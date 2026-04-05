import { Clock, XCircle, SearchX } from 'lucide-react'

type Props = {
  searchParams: Promise<{ reason?: string; name?: string }>
}

export default async function SocietyBlockedPage({ searchParams }: Props) {
  const { reason, name } = await searchParams

  let icon: React.ReactNode
  let title: string
  let message: string

  if (reason === 'not-found') {
    icon = <SearchX className="h-14 w-14 text-gray-400 mx-auto mb-5" />
    title = 'Vereniging niet gevonden'
    message =
      'De vereniging die je probeert te bezoeken bestaat niet of is verwijderd. Controleer de link en probeer het opnieuw.'
  } else if (reason === 'denied') {
    icon = <XCircle className="h-14 w-14 text-red-500 mx-auto mb-5" />
    title = 'Toegang geweigerd'
    message = name
      ? `De aanvraag van vereniging "${name}" is afgewezen door de beheerders. Neem contact op met Socera voor meer informatie.`
      : 'De aanvraag van deze vereniging is afgewezen door de beheerders.'
  } else {
    // pending (default)
    icon = <Clock className="h-14 w-14 text-amber-500 mx-auto mb-5" />
    title = 'Wachten op goedkeuring'
    message = name
      ? `Vereniging "${name}" is geregistreerd maar wacht nog op goedkeuring van de Socera-beheerders. Je ontvangt een melding zodra de aanvraag is verwerkt.`
      : 'Deze vereniging wacht nog op goedkeuring van de Socera-beheerders.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-md w-full bg-white p-10 rounded-2xl shadow-lg">
        {icon}

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>

        <p className="text-gray-600 leading-relaxed mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Terug naar home
          </a>
          {reason !== 'not-found' && (
            <a
              href="mailto:support@socera.nl"
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Contact opnemen
            </a>
          )}
        </div>

        {reason === 'pending' && (
          <p className="mt-6 text-xs text-gray-400">
            Ververs de pagina als je denkt dat de status al is bijgewerkt.
          </p>
        )}
      </div>
    </div>
  )
}
