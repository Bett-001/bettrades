//+------------------------------------------------------------------+
//|                                              BetTradesSync.mq5   |
//|                         BetTrades MT5 Auto-Sync EA  v1.0         |
//|          Automatically logs closed trades to your journal         |
//+------------------------------------------------------------------+
#property copyright "BetTrades"
#property link      "https://bettrades.com"
#property version   "1.00"
#property description "Syncs every closed trade to your BetTrades Trading Journal in real time."

//--- Inputs
input string BETTRADES_TOKEN    = "";   // <-- Paste your API token from Journal > Connect MT5
input string BETTRADES_ENDPOINT = "https://hjqgjbeuwzcxnusxvrzy.supabase.co/functions/v1/mt5-sync";

//--- Internal state
static datetime g_lastTimerCheck = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   if(StringLen(BETTRADES_TOKEN) == 0)
   {
      Alert("BetTradesSync: API Token is empty!\n\n"
            "Steps:\n"
            "1. Open your BetTrades Trading Journal\n"
            "2. Click 'Connect MT5'\n"
            "3. Generate a token and paste it in this EA's Inputs");
      return(INIT_PARAMETERS_INCORRECT);
   }
   EventSetTimer(60);  // fallback poll every 60 s
   PrintFormat("[BetTrades] Initialized. Endpoint: %s", BETTRADES_ENDPOINT);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   EventKillTimer();
   Print("[BetTrades] EA removed.");
}

//+------------------------------------------------------------------+
// Real-time: fires immediately when a deal is added to history
void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest&     request,
                        const MqlTradeResult&      result)
{
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD) return;
   if(trans.deal == 0) return;
   SyncDeal(trans.deal);
}

//+------------------------------------------------------------------+
// Fallback: catches any deal the real-time handler may have missed
void OnTimer()
{
   datetime now = TimeCurrent();
   if(g_lastTimerCheck == 0) g_lastTimerCheck = now - 120;

   HistorySelect(g_lastTimerCheck, now);
   int total = HistoryDealsTotal();

   for(int i = 0; i < total; i++)
   {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket == 0) continue;
      SyncDeal(ticket);
   }
   g_lastTimerCheck = now;
}

//+------------------------------------------------------------------+
void SyncDeal(ulong ticket)
{
   if(!HistoryDealSelect(ticket)) return;

   //--- Only process closing deals (position exits)
   ENUM_DEAL_ENTRY dealEntry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(ticket, DEAL_ENTRY);
   if(dealEntry != DEAL_ENTRY_OUT && dealEntry != DEAL_ENTRY_OUT_BY) return;

   //--- Only real trade deals, not balance/credit adjustments
   ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE);
   if(dealType != DEAL_TYPE_BUY && dealType != DEAL_TYPE_SELL) return;

   //--- Exit deal info
   string   symbol    = HistoryDealGetString (ticket, DEAL_SYMBOL);
   double   volume    = HistoryDealGetDouble (ticket, DEAL_VOLUME);
   double   exitPrice = HistoryDealGetDouble (ticket, DEAL_PRICE);
   double   profit    = HistoryDealGetDouble (ticket, DEAL_PROFIT)
                      + HistoryDealGetDouble (ticket, DEAL_SWAP)
                      + HistoryDealGetDouble (ticket, DEAL_COMMISSION);
   long     posId     = HistoryDealGetInteger(ticket, DEAL_POSITION_ID);

   //--- Find the corresponding IN deal to get entry price & direction
   double   entryPrice = exitPrice;
   datetime entryTime  = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
   string   direction  = (dealType == DEAL_TYPE_BUY) ? "SELL" : "BUY"; // OUT type is opposite

   if(HistorySelectByPosition(posId))
   {
      int n = HistoryDealsTotal();
      for(int j = 0; j < n; j++)
      {
         ulong d = HistoryDealGetTicket(j);
         ENUM_DEAL_ENTRY e = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(d, DEAL_ENTRY);
         if(e == DEAL_ENTRY_IN)
         {
            entryPrice = HistoryDealGetDouble (d, DEAL_PRICE);
            entryTime  = (datetime)HistoryDealGetInteger(d, DEAL_TIME);
            ENUM_DEAL_TYPE et = (ENUM_DEAL_TYPE)HistoryDealGetInteger(d, DEAL_TYPE);
            direction  = (et == DEAL_TYPE_BUY) ? "BUY" : "SELL";
            break;
         }
      }
   }

   //--- Format date  "YYYY-MM-DD HH:MM"  (server/broker time)
   string dateStr = TimeToString(entryTime, TIME_DATE | TIME_MINUTES);
   StringReplace(dateStr, ".", "-");

   //--- Build JSON payload (no external library needed)
   string json = StringFormat(
      "{"
        "\"token\":\"%s\","
        "\"ticket\":%I64u,"
        "\"symbol\":\"%s\","
        "\"type\":\"%s\","
        "\"entry\":%.5f,"
        "\"exit\":%.5f,"
        "\"lots\":%.2f,"
        "\"pnl\":%.2f,"
        "\"date\":\"%s\","
        "\"sl\":0,"
        "\"tp\":0"
      "}",
      BETTRADES_TOKEN,
      ticket,
      symbol,
      direction,
      entryPrice,
      exitPrice,
      volume,
      profit,
      dateStr
   );

   //--- Send HTTP POST
   char   postData[];
   char   response[];
   string responseHeaders;

   StringToCharArray(json, postData, 0, StringLen(json));

   ResetLastError();
   int httpCode = WebRequest(
      "POST",
      BETTRADES_ENDPOINT,
      "Content-Type: application/json\r\n",
      5000,
      postData,
      response,
      responseHeaders
   );

   if(httpCode == 200)
   {
      PrintFormat("[BetTrades] Synced: %s %s | P&L: %.2f | Ticket #%I64u",
                  direction, symbol, profit, ticket);
   }
   else if(httpCode == -1)
   {
      int err = GetLastError();
      PrintFormat("[BetTrades] WebRequest error %d. "
                  "Fix: Tools > Options > Expert Advisors > "
                  "Allow WebRequest for listed URL > Add: %s",
                  err, BETTRADES_ENDPOINT);
   }
   else
   {
      PrintFormat("[BetTrades] Sync failed HTTP %d | Ticket #%I64u | Response: %s",
                  httpCode, ticket, CharArrayToString(response));
   }
}
//+------------------------------------------------------------------+
