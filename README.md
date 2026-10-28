# wiz

Decide quando il Mac dorme. Serve a lasciare Claude Code al lavoro anche a coperchio chiuso.
Il nome viene da Mona Lisa Overdrive di William Gibson: la wiz è lo stimolante di Mona.

| Comando | Cosa fa |
|---|---|
| `wiz` | mostra lo stato attuale, letto dal sistema |
| `wiz sleep` | manda il Mac a dormire adesso |
| `wiz sober` | impostazioni normali: dorme da solo quando non lo usi |
| `wiz high` | non dorme finché il coperchio è aperto |
| `wiz bender` | non dorme neanche col coperchio chiuso |
| `wiz speedball` | come bender mentre Claude Code lavora; quando tocca a te, sonno normale |

Attenzione: `bender` resta attivo anche dopo un riavvio. Chiuso nello zaino, il Mac scalda.

## Installazione

1. Copia il comando:

   ```
   mkdir -p ~/.local/bin && cp bin/wiz ~/.local/bin/wiz && chmod +x ~/.local/bin/wiz
   ```

   `~/.local/bin` deve stare nel `PATH`.

2. Per `speedball` installa il mod di Claude Code. Al prompt di una sessione:

   ```
   /plugin install wiz --marketplace dj-filippo241/wiz
   ```

   Da una shell: `claude plugin install wiz --marketplace dj-filippo241/wiz`.

Alla prima `wiz speedball` macOS chiede la password una volta. Crea `/etc/sudoers.d/wiz`, che
permette senza password solo `pmset -a disablesleep 0` e `pmset -a disablesleep 1`.
Per toglierlo: `sudo rm /etc/sudoers.d/wiz`.

## Come funziona speedball

Il mod avvisa `wiz` quando Claude lavora e quando si ferma (solo la sessione principale, non i
subagenti). Claude lavora all'inizio del turno e a ogni passo. Si ferma a fine turno, quando lo
interrompi, quando ti chiede un permesso o una risposta, e quando la sessione si chiude.

Il Mac resta sveglio anche quando Claude ha finito il turno ma ha una shell in background (una
simulazione, un server): finisce la shell, torna il sonno normale.

Finché almeno una sessione lavora, il sonno è disattivato. Quando tutte si fermano, il sonno torna
normale e, se il coperchio è chiuso, il Mac dorme subito. Una guardia controlla ogni 30 secondi
che le sessioni al lavoro esistano ancora: un Claude chiuso male non tiene sveglio il Mac.
