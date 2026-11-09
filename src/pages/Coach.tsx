import { useState } from 'react'
import Icon from '../components/Icon'
import { PageHeader } from '../components/ui'
import { coachDemo } from '../data/mock'

export default function Coach() {
  const [text, setText] = useState('')

  return (
    <div className="px-4">
      <PageHeader
        title="Coach IA"
        subtitle="Conversation"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            IA non branchée
          </span>
        }
      />

      <div className="glass flex items-start gap-3 border-ember-500/30 p-4 text-sm text-white/70">
        <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-ember-400" />
        <p>
          Maquette de l’interface. Le coach n’est <strong>pas encore connecté</strong> : la conversation ci-dessous est
          un exemple écrit à la main, et la saisie est désactivée. L’IA (Gemini, côté serveur) arrive en Phase 4.
        </p>
      </div>

      <div className="stagger mt-5 space-y-3">
        {coachDemo.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                m.from === 'me'
                  ? 'rounded-br-lg bg-gradient-to-br from-mint-300 to-mint-500 text-ink-950'
                  : 'glass rounded-bl-lg text-white/85'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[calc(var(--safe-bottom)+92px)] z-40 px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="glass-strong mx-auto flex max-w-md items-center gap-2 rounded-full p-1.5 pl-5 opacity-70"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled
            placeholder="Disponible en Phase 4…"
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-white/35 focus:outline-none"
          />
          <button
            type="submit"
            disabled
            aria-label="Envoyer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/40"
          >
            <Icon name="send" size={18} />
          </button>
        </form>
      </div>
      <div className="h-16" />
    </div>
  )
}
