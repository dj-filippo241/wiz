import type { Register } from 'claude-code'

// exec sostituisce sh: così il genitore di wiz è il processo di Claude, che wiz usa per ritrovare la sessione.
const WIZ = 'exec "$HOME/.local/bin/wiz" "$1" "$2"'

// Le notifiche in cui Claude si ferma ad aspettare la persona.
const ASPETTA = ['permission_prompt', 'idle_prompt', 'elicitation_dialog', 'agent_needs_input']

export const register: Register = on => {
  // Claude lavora: all'inizio del turno e a ogni passo, così riparte anche dopo un permesso.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_lavora', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return next(e)
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_lavora', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return yield* next(e)
  })

  // Tocca alla persona: fine del turno (anche interrotto), una domanda o un permesso, la chiusura.
  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId === undefined) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_tocca', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return r
  })

  on('classic.Notification', async ($, e, next) => {
    if (ASPETTA.includes(e.notification_type)) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_tocca', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return next(e)
  })

  on('session.end', async ($, e, next) => {
    await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_fine', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    return next(e)
  })
}
