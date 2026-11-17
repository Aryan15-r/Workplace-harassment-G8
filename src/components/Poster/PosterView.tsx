import { ArrowLeft, Printer } from 'lucide-react'
import { CHILDREN, MAIN_TOPICS, ROOT_TOPIC, SUB_TOPICS } from '@/data/topics'
import { useAppStore } from '@/store/useAppStore'

/**
 * Printable A3 landscape chart. It is a dedicated static layout built from the
 * same topic data as the 3D universe — not a screenshot — and prints on one
 * page through `@media print` in poster.css.
 */
export function PosterView() {
  const setPoster = useAppStore((state) => state.setPoster)

  return (
    <div className="poster-root">
      <div className="poster-toolbar no-print">
        <button type="button" className="poster-btn" onClick={() => setPoster(false)}>
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back to universe
        </button>
        <div className="flex items-center gap-3">
          <span className="poster-toolbar__meta hidden sm:inline">
            A3 landscape · 420 × 297 mm · one page
          </span>
          <button
            type="button"
            className="poster-btn poster-btn--primary"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={1.8} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="poster-viewport">
        <article className="poster-sheet">
          <header className="poster-header">
            <div>
              <p className="poster-kicker">Educational chart · College presentation</p>
              <h1 className="poster-title">Workplace Harassment</h1>
              <p className="poster-lead">
                Understanding workplace harassment, its effects, India’s legal protections and the
                shared responsibility of building a safe, respectful working environment.
              </p>
              <div className="poster-stats">
                <span>{MAIN_TOPICS.length} topics</span>
                <span>{SUB_TOPICS.length} sub-topics</span>
                <span>POSH Act, 2013</span>
              </div>
            </div>

            <div className="poster-hero">
              <p className="poster-hero__label">Central topic</p>
              <h2>{ROOT_TOPIC.title}</h2>
              <p>{ROOT_TOPIC.definition}</p>
              <ul className="poster-keywords">
                {ROOT_TOPIC.keywords.map((keyword) => (
                  <li key={keyword}>{keyword}</li>
                ))}
              </ul>
            </div>
          </header>

          <div className="poster-grid">
            {MAIN_TOPICS.map((topic) => {
              const children = CHILDREN[topic.id] ?? []
              return (
                <section className="poster-card" key={topic.id}>
                  <div className="poster-card__head">
                    <span className="poster-card__num">
                      {String(topic.index).padStart(2, '0')}
                    </span>
                    <h3>{topic.title}</h3>
                  </div>
                  <p className="poster-card__summary">{topic.summary}</p>
                  {children.length > 0 && (
                    <ul className="poster-card__subs">
                      {children.map((child) => (
                        <li key={child.id}>{child.navTitle}</li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>

          <footer className="poster-footer">
            <div>
              <p className="poster-quote">
                “A workplace should be a place where every person feels safe, respected, and
                valued.”
              </p>
              <p className="poster-note poster-note--muted">
                Case study on this chart is a fictional teaching example.
              </p>
            </div>
            <p className="poster-note">
              <strong>Scope note:</strong> the POSH Act, 2013 addresses sexual harassment of women
              at the workplace. Other forms of harassment, and harassment of other genders, are
              addressed through service rules, criminal law (Bharatiya Nyaya Sanhita, 2023) and
              organisational policy.
            </p>
            <p className="poster-meta">
              Workplace Harassment
              <br />
              Interactive Knowledge Universe
            </p>
          </footer>
        </article>
      </div>
    </div>
  )
}
