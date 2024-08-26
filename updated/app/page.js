import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Video Editor App</title>
        <meta name="description" content="Transform Your Videos with Ease" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-900 text-white py-6">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">Video Editor App</h1>
          <ul className="flex space-x-6">
            <li><a href="#features" className="hover:text-gray-400">Features</a></li>
          </ul>
        </nav>
      </header>

      <section id="hero" className="bg-gray-800 text-white h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Videos with Ease</h2>
          <p className="text-lg md:text-xl mb-8">Add overlay text and enhance your videos effortlessly. Upload your video and get started!</p>
          <a href="/video-process" className="bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600">Get Started</a>
        </div>
      </section>

      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-900">Features</h2>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">Easy Video Upload</h3>
              <p>Upload your video in seconds with our simple interface.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">Customizable Text Overlay</h3>
              <p>Add and style text overlays to personalize your videos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">High-Quality Output</h3>
              <p>Receive professionally edited videos with clear text overlays.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="bg-gray-900 text-white py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <a href="#upload" className="bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600">Upload Your Video</a>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-4 text-center">
        <div className="container mx-auto">
          <p>&copy; 2024 Video Editor App. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
