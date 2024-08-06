"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import character from '../../public/Learnability (GenAi) logo svg/character.svg';
import tutor from '../../public/tutor.svg';
import revision from '../../public/revision.svg';
import flashcard from '../../public/flashcard.svg';
import mindmap from '../../public/mindmap.svg';
import Link from 'next/link';

const Landing: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState('main');

  useEffect(() => {
    const handleScroll = () => {
      const mainSection = document.getElementById('main-section');
      const featuresSection = document.getElementById('features-section');
      const additionalSection = document.getElementById('additional-section');

      if (mainSection && featuresSection && additionalSection) {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const mainPosition = mainSection.offsetTop;
        const featuresPosition = featuresSection.offsetTop;
        const additionalPosition = additionalSection.offsetTop;

        if (scrollPosition > additionalPosition) {
          setVisibleSection('additional');
        } else if (scrollPosition > featuresPosition) {
          setVisibleSection('features');
        } else {
          setVisibleSection('main');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <header className="w-full p-4 flex justify-between items-center bg-gray-800 dark:bg-gray-800 shadow-lg h-[56px]">
        <div className="flex items-center">
          <div className=" p-1">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold ml-2 text-white">.ai</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="#home" className="text-white hover:text-purple-200 transition-colors">Home</a>
          <a href="#about" className="text-white hover:text-purple-200 transition-colors">About Us</a>
          <a href="#contact" className="text-white hover:text-purple-200 transition-colors">Contact</a>
          <ThemeToggle />
        </nav>
      </header>

      {/* Main Section */}
      <section
        id="main-section"
        className={`transition-all duration-1000 ease-out transform ${
          visibleSection === 'main' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        } py-20 bg-gradient-to-b from-purple-100 to-white dark:from-gray-800 dark:to-gray-900`}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">Welcome to Learnability AI - Your Study Companion</h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">Your Path to Academic Excellence</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">At Learnability, we understand that every student is unique. Our mission is to match you with experienced tutors who will provide personalized support, inspire confidence, and ignite your passion for learning.</p>
            <Link href={"/signup-login"}>
            <button  className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">Get Started</button>
            </Link>
          </div>
          <div className="md:w-1/2 ">
            <Image src={character} alt="Boy Studying" className="w-full max-w-md mx-auto mt-[18px]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className={`transition-all duration-1000 ease-out transform ${
          visibleSection === 'features' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        } bg-white dark:bg-gray-800 py-20`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: tutor, title: "Personalized Learning", description: "Tailored tutoring to fit each student's unique needs." },
              { icon: revision, title: "Master Your Knowledge", description: "Interactive revision sessions to reinforce learning." },
              { icon: flashcard, title: "Boost Your Retention", description: "Engaging flashcards for efficient memorization." },
              { icon: mindmap, title: "See It, Remember It", description: "Visual mind maps to enhance understanding." },
            ].map((feature, index) => (
              <div key={index} className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-gray-600 rounded-full p-3">
                  <Image src={feature.icon} alt={feature.title} className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Section */}
      <section
        id="additional-section"
        className={`transition-all duration-1000 ease-out transform ${
          visibleSection === 'additional' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        } bg-purple-50 dark:bg-gray-900 py-20`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Discover Our Personalized Tutor</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Experience engaging and effective learning strategies tailored just for you.</p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">Learn More</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Learnability AI. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#social" className="hover:text-purple-400 transition-colors">Social Media</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;