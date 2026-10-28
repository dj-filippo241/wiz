import type { Register } from 'claude-code'

// exec sostituisce sh: così il genitore di wiz è il processo di Claude, che wiz usa per ritrovare la sessione.
const WIZ = 'exec "$HOME/.local/bin/wiz" "$1" "$2"'

export const register: Register = on => {
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_lavora', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId === undefined) {
      await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_tocca', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    }
    return r
  })

  on('session.end', async ($, e, next) => {
    await $.process.run(['/bin/sh', '-c', WIZ, 'wiz', '_tocca', $.session.id()], { timeoutMs: 10000 }).catch(() => {})
    return next(e)
  })
}
