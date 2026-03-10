export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-gray-100 dark:from-black dark:via-slate-900 dark:to-black font-sans">
      <main className="max-w-6xl mx-auto py-20 px-6">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Fast, Reliable DNA Synthesis — Built for Researchers
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              Design, optimize and order DNA sequences with enterprise-grade
              quality controls, transparent pricing, and fast turnaround.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a
                href="/order"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded shadow"
              >
                Order DNA
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 rounded"
              >
                View Dashboard
              </a>
            </div>

            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-200">Academic discount</strong> available — contact us for bulk orders and institutional pricing.
            </div>
          </div>

          {/* Decorative / illustrative */}
          <div className="mx-auto w-full max-w-md">
            <div className="relative bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-lg">
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-black flex items-center justify-center">
                {/* Simple SVG DNA illustration */}
                <svg viewBox="0 0 120 120" className="h-64 w-64" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <g fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 10 C40 30, 40 90, 20 110" />
                    <path d="M40 10 C60 30, 60 90, 40 110" />
                    <path d="M60 10 C80 30, 80 90, 60 110" />
                    <path d="M80 10 C100 30, 100 90, 80 110" />
                    <path d="M100 10 C120 30, 120 90, 100 110" />
                    <path strokeDasharray="4 6" d="M20 20 L100 100" />
                    <path strokeDasharray="4 6" d="M20 40 L100 120" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white text-center">Why researchers pick us</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-5 text-center shadow-sm">
              <h3 className="font-medium text-slate-800 dark:text-white">Quality Control</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Every order includes QC reports and sequencing verification.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-5 text-center shadow-sm">
              <h3 className="font-medium text-slate-800 dark:text-white">Transparent Pricing</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">See pricing up front based on length, modifications and purification.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-5 text-center shadow-sm">
              <h3 className="font-medium text-slate-800 dark:text-white">Fast Turnaround</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Rush options available for urgent projects and academic timelines.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-5 text-center shadow-sm">
              <h3 className="font-medium text-slate-800 dark:text-white">Secure Data</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We follow strict data handling and access controls for your sequences.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white text-center">How it works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <h4 className="mt-2 font-medium">Submit Sequence</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Paste a sequence or upload FASTA and choose synthesis options.</p>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <h4 className="mt-2 font-medium">Checkout Securely</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pay with Stripe and track your order status from the dashboard.</p>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <h4 className="mt-2 font-medium">Receive QC</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We deliver sequences with sequencing reports and optional plasmid prep.</p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold">Ready to start your project?</h3>
            <p className="mt-2 text-sm">Create an account and place your first order in minutes.</p>
            <div className="mt-4 flex gap-3 justify-center">
              <a href="/auth/register" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold">Create Account</a>
              <a href="/order" className="border border-white/30 px-4 py-2 rounded">Order Now</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
