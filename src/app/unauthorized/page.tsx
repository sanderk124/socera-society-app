import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
            <div className="text-center max-w-md w-full bg-white p-10 rounded-2xl shadow-lg">
                <ShieldX className="h-14 w-14 text-red-500 mx-auto mb-5" />

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Geen toegang</h1>

                <p className="text-gray-600 leading-relaxed mb-8">
                    Je hebt geen beheerdersrechten voor deze vereniging. Alleen eigenaren en admins
                    hebben toegang tot dit dashboard. Neem contact op met de eigenaar van de vereniging
                    als je denkt dat dit een fout is.
                </p>

                <a
                    href="/"
                    className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Terug naar home
                </a>
            </div>
        </div>
    )
}