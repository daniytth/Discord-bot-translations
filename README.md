============================================================
           DISCORD BOT ASSETS PACK - v1.0.0
              Coding by DigiFan - 2026
============================================================

Üdvözöllek a professzionális DigiFan Bot Framework-ben!
Ez a csomag mindent tartalmaz, ami egy modern, skálázható
Discord bot indításához szükséges.

------------------------------------------------------------
1. FŐBB FUNKCIÓK
------------------------------------------------------------
* Dinamikus Command Handler: Automatikus Slash Command kezelés.
* XP Rendszer: SQLite alapú szintlépés és adatmentés.
* Ticket Rendszer: Interaktív gombos ügyfélszolgálati modul.
* Admin Modul: Beépített Ban/Kick és moderációs eszközök.
* DigiFan Branding: Egységesített vízjelek és konzol logok.

------------------------------------------------------------
2. TELEPÍTÉSI ÚTMUTATÓ
------------------------------------------------------------
1. Telepítsd a Node.js-t (v16.9.0 vagy újabb).
2. Nyisd meg a terminált a bot mappájában.
3. Futtasd a következő parancsot a függőségekhez:
   npm install discord.js dotenv sqlite3 better-sqlite3

4. Hozz létre egy '.env' fájlt és add meg az adataidat:
   DISCORD_TOKEN=A_TE_TOKENED
   CLIENT_ID=A_BOT_ID_JE

5. Regisztráld a parancsokat:
   node deploy-commands.js

6. Indítsd el a botot:
   node src/index.js

------------------------------------------------------------
3. MAPPA STRUKTÚRA
------------------------------------------------------------
/src
  /commands   -> Ide kerülnek a .js parancsfájlok
  /events     -> Az eseménykezelők helye (ready, message)
  /utils      -> Adatbázis és segédfunkciók (db.js)
  index.js    -> A bot központi indítófájlja

------------------------------------------------------------
4. HASZNÁLAT ÉS JOGOK
------------------------------------------------------------
A bot indításakor a konzolon meg kell jelennie a 
"Coding by DigiFan" feliratnak. Ez jelzi, hogy a rendszer
operatív és minden modul betöltődött.

Parancsok:
- /setup-ticket : Ticket panel létrehozása (Admin)
- /ban          : Felhasználó kitiltása (Admin)
- Üzenetküldés  : Automatikus XP növelés

------------------------------------------------------------
Készítette: DigiFan
Verzió: 1.0.0 (Release Candidate)
Státusz: Stabil
============================================================