import Image from "next/image";
import heroImage from "@/assets/pictures/hero-image.png";
export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-64px)] w-full overflow-hidden relative">
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-start">
        <div className="w-full md:w-1/2 pt-12 md:pt-24 z-10">
          <h1 className="text-5xl md:text-7xl font-semibold leading-normal mb-6">
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return "Good Morning! ☕️";
              if (hour < 18) return "Good Afternoon! ☀️";
              return "Good Evening! 🌙";
            })()}
            <br />
            Welcome to
            <br />
            LearnHere...
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg">
            Your one-stop platform for all your learning needs. Join us and
            start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Sign Up
            </button>
            <button className="bg-white text-gray-800 px-8 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
              Explore More
            </button>
          </div>
        </div>

        {/* Right visual area with 3D stairs and coin */}
        <div className="w-full md:w-1/2">
          <Image
            src={heroImage}
            alt="StudyHere Illustration"
            className="w-auto h-full object-cover absolute top-0 right-0 z-0"
          />
        </div>
      </div>
    </section>
  );
}
