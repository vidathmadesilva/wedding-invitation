"use client";

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: ["normal", "italic"], 
  weight: ["400", "600", "700"] 
});

// Scroll Animation Wrapper Component
const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex-1 aspect-square bg-[#F4EEDC]/40 backdrop-blur-md rounded-xl border-[1.5px] border-[#C19A5B]/40 p-1 shadow-sm">
    <div className="flex flex-col items-center justify-center w-full h-full rounded-lg border-[1px] border-[#C19A5B]/60 bg-transparent overflow-hidden">
      <div className="relative h-8 md:h-12 w-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${playfair.className} absolute text-[1.7rem] md:text-[2.5rem] font-semibold text-[#214A3B]`}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#7A7369] font-semibold mt-1">
        {label}
      </span>
    </div>
  </div>
);

// RSVP Content Translations
const rsvpContent = {
  en: {
    subtitle: "KINDLY REPLY",
    title: "Will You Join Us?",
    desc: "We joyfully await your presence. Please let us know if you will be joining us.",
    deadline: "Kindly respond by 20th November 2026",
    nameLabel: "Full Name",
    namePlaceholder: "Your name",
    attendLabel: "Will you be attending?",
    guestLabel: "Number of Guests",
    accept: "Joyfully Accept",
    decline: "Regretfully Decline",
    button: "SEND RSVP",
    sending: "SENDING...",
    success: "Thank you for your response!",
  },
  si: {
    subtitle: "කරුණාකර පිළිතුරු දෙන්න",
    title: "ඔබ අප හා එක්වෙනවාද?",
    desc: "ඔබගේ පැමිණීම අපි ආදරයෙන් අපේක්ෂා කරමු. ඔබගේ සහභාගීත්වය කරුණාකර අපට දන්වන්න.",
    deadline: "කරුණාකර 2026 නොවැම්බර් 20 ට පෙර පිළිතුරු සපයන්න",
    nameLabel: "සම්පූර්ණ නම",
    namePlaceholder: "ඔබගේ නම",
    attendLabel: "ඔබ සහභාගී වෙනවාද?",
    guestLabel: "සහභාගී වන ගණන",
    accept: "සතුටින් සහභාගී වෙමි",
    decline: "කනගාටුවෙන් ප්‍රතික්ෂේප කරමි",
    button: "පිළිතුර යවන්න",
    sending: "යවමින් පවතී...",
    success: "ඔබගේ පිළිතුර ලැබුණා. ස්තූතියි!",
  }
};

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Music States & Ref
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // RSVP States
  const [rsvpLang, setRsvpLang] = useState<'en' | 'si'>('en');
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [rsvpGuests, setRsvpGuests] = useState<number>(1);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // ======= GOOGLE APPS SCRIPT URL =======
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwu2fCswqfnr8MkuorvoRgUGjDqWr-2GHpDZ5TQg9ItiVNgtF-4OHjhCpVvpVlVVyMNEg/exec"; 

  useEffect(() => {
    const targetDate = new Date("2026-12-02T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveTheDate = () => {
    const eventTitle = "Rohitha & Sasanjalee's Wedding";
    const eventLocation = "Hotel Sueen Nature, Baduraliya, Sri Lanka";
    const eventDetails = "Join us to celebrate our wedding ceremony!";
    const startTime = "20261202T033000Z";
    const endTime = "20261202T053000Z"; 

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startTime}\nDTEND:${endTime}\nSUMMARY:${eventTitle}\nLOCATION:${eventLocation}\nDESCRIPTION:${eventDetails}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'wedding_invitation.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}`;
      window.open(googleCalendarUrl, '_blank');
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || rsvpAttending === null) return;
    
    setRsvpStatus('loading');

    if (!GOOGLE_SCRIPT_URL) {
      setTimeout(() => setRsvpStatus('success'), 2000);
      return;
    }

    const formData = new FormData();
    formData.append("Name", rsvpName);
    formData.append("Attending", rsvpAttending ? "Yes" : "No");
    formData.append("Language", rsvpLang === 'en' ? "English" : "Sinhala");
    formData.append("Guests", rsvpAttending ? rsvpGuests.toString() : "0");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setRsvpStatus('success');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setRsvpStatus('idle');
      alert("Error submitting. Please try again.");
    }
  };

  // Music Toggle Function
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Open Invitation and Play Music Function
  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play blocked by browser", e));
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/bg-music.mp3" loop />

      {isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed top-4 left-4 z-50 bg-[#F4EEDC]/80 border border-[#C19A5B]/40 rounded-full p-2.5 shadow-sm backdrop-blur-md text-[#214A3B] hover:bg-[#214A3B] hover:text-white transition-all duration-300"
          aria-label="Toggle Music"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      )}

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.main
            key="welcome-screen"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="relative min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-70">
              <Image src="/images/bg.jpeg" alt="Floral Background" fill className="object-cover" priority />
            </div>

            <div className="absolute top-0 w-full flex justify-center z-10 opacity-30 -translate-y-1/2">
              <Image src="/images/mandala.png" alt="Mandala" width={600} height={600} className="animate-[spin_40s_linear_infinite] max-w-[120%] md:max-w-full" />
            </div>

            <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 mt-8 md:mt-16">
              <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8B7D6B] mb-3 font-serif">
                The Wedding Of
              </p>

              <div className="flex items-center justify-center w-full max-w-[200px] mb-8 opacity-70">
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#C19A5B] mx-2"></div>
                  <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
              </div>

              <div className={`flex flex-col items-center text-[#1E3F20] drop-shadow-sm mb-8 ${playfair.className}`}>
                <h1 className="text-5xl md:text-6xl italic font-medium tracking-wide">Rohitha</h1>
                <span className="text-3xl md:text-4xl text-[#C91500] my-2 font-normal">&</span>
                <h1 className="text-5xl md:text-6xl italic font-medium tracking-wide">Sasanjalee</h1>
              </div>

              <p className="text-xs md:text-sm text-[#403635] mb-12 tracking-widest font-serif ">
                Wednesday, 2<sup className="text-[9px]">nd</sup> December 2026
              </p>

              <button 
                onClick={handleOpenInvitation}
                className="border border-[#395144] text-[#395144] px-8 md:px-10 py-3 rounded-full uppercase tracking-[0.2em] text-[10px] font-semibold hover:bg-[#395144] hover:text-white transition-all duration-700 ease-in-out backdrop-blur-sm bg-white/40 shadow-sm cursor-pointer"
              >
                Open Invitation
              </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-10 translate-y-7 md:translate-y-[10%]">
              <Image src="/images/perahera.PNG" alt="Perahera Elephants" width={1920} height={300} className="w-full h-auto object-cover object-bottom" />
            </div>
          </motion.main>

        ) : (
          
          <motion.main
            key="details-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative min-h-screen bg-[#FDFBF7] font-serif"
          >
            <div className="fixed inset-0 z-0 pointer-events-none">
              <Image src="/images/bg.jpeg" alt="Floral Background" fill className="object-cover opacity-80" />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                className="absolute top-[0%] w-full flex justify-center opacity-25 -translate-y-[40%]"
              >
                <Image src="/images/mandala.png" alt="Mandala" width={800} height={800} className="max-w-[150%] md:max-w-full" />
              </motion.div>
            </div>

            <div className="relative z-10 w-full h-full min-h-screen overflow-y-auto flex flex-col items-center scrollbar-hide">
                
                <div className="w-full max-w-md flex flex-col items-center pt-8 px-4">
                    
                    {/* ======= 1. FIRST FRAME ======= */}
                    <ScrollReveal className="w-full max-w-md bg-[#F4EEDC]/40 backdrop-blur-md rounded-[2rem] border-[1.5px] border-[#C19A5B]/40 p-2 md:p-2.5 shadow-sm mt-8">
                        <div className="flex flex-col items-center rounded-[1.6rem] border-[1px] border-[#C19A5B]/60 pt-10 pb-4 px-4 relative overflow-hidden h-full bg-transparent">
                            <div className="text-center text-[#1E3F20] mb-5">
                                <h2 className="text-lg md:text-xl font-bold tracking-[0.25em] uppercase mb-2">SRI SUBA MANGALAM!</h2>
                                <p className="text-[10px] md:text-[10px] tracking-[0.30em] uppercase text-[#8B7D6B]">YOU ARE INVITED TO THE WEDDING OF</p>
                            </div>

                            <div className={`flex flex-col items-center text-center text-[#1E3F20] drop-shadow-sm mb-6 ${playfair.className}`}>
                                <h1 className="text-4xl md:text-5xl italic font-semibold tracking-wide">Rohitha</h1>
                                <span className="text-2xl md:text-3xl text-[#C91500] my-1 font-normal">&</span>
                                <h1 className="text-4xl md:text-5xl italic font-semibold tracking-wide">Sasanjalee</h1>
                            </div>

                            <div className="flex items-center justify-center w-full max-w-[200px] mb-8 opacity-70">
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                                <div className="w-1.5 h-1.5 rotate-45 bg-[#C19A5B] mx-2"></div>
                                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-center mb-10 w-full px-4 md:px-8">
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="w-24 md:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#1E3F20] to-transparent mb-3 opacity-60"></div>
                                    <span className="text-xs md:text-base text-[#1E3F20] uppercase tracking-[0.15em] font-bold font-serif">DECEMBER</span>
                                    <div className="w-24 md:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#1E3F20] to-transparent mt-3 opacity-60"></div>
                                </div>
                                <div className={`${playfair.className} text-5xl md:text-6xl font-medium text-[#1E3F20] px-3 drop-shadow-sm`}>2</div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="w-24 md:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#1E3F20] to-transparent mb-3 opacity-60"></div>
                                    <span className="text-xs md:text-sm text-[#1E3F20] uppercase tracking-[0.25em] font-bold font-serif">2026</span>
                                    <div className="w-24 md:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#1E3F20] to-transparent mt-3 opacity-60"></div>
                                </div>
                            </div>

                            <div className="w-full max-w-[190px] md:max-w-[220px] mx-auto mb-22 z-10 relative">
                                <Image src="/images/couple_1.png" alt="Couple Art" width={300} height={400} className="w-full h-auto" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full z-0 translate-y-5">
                                <Image src="/images/perahera.PNG" alt="Perahera" width={800} height={200} className="w-full h-auto object-cover object-bottom opacity-90" />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ======= 2. SCROLL DOWN ANIMATION ======= */}
                    <div className="flex flex-col items-center mt-8 mb-5 opacity-100">
                        <span className="text-[9px] tracking-[0.3em] text-[#3A4A39] uppercase mb-4 font-semibold">Scroll Down</span>
                        <motion.div 
                            animate={{ y: [0, 8, 0] }} 
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-8 h-8 rounded-full border-[2px] border-[#C19A5B] flex items-center justify-center text-[#3A4A39]"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </motion.div>
                    </div>

                    {/* ======= 3. SECOND FRAME ======= */}
                    <ScrollReveal className="w-full max-w-md bg-[#F4EEDC]/40 backdrop-blur-md rounded-[2rem] border-[1.5px] border-[#C19A5B]/40 p-2 md:p-2.5 shadow-sm mb-16">
                        <div className="flex flex-col items-center rounded-[1.6rem] border-[1px] border-[#C19A5B]/60 pt-16 pb-14 px-6 md:px-10 relative overflow-hidden h-full bg-transparent text-center">
                            <div className="w-full max-w-[250px] md:max-w-[290px] mx-auto mb-15 relative">
                                <Image src="/images/second_photo.png" alt="Couple Illustration 2" width={300} height={450} className="w-full h-auto object-contain" />
                            </div>
                            <h3 className={`${playfair.className} text-3xl md:text-[2.5rem] font-semibold text-[#214A3B] mb-5 drop-shadow-sm`}>Together Forever</h3>
                            <div className="flex items-center justify-center w-full max-w-[200px] mb-8 opacity-70">
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                                <div className="w-1.5 h-1.5 rotate-45 bg-[#C19A5B] mx-2"></div>
                                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                            </div>
                            <p className={`${playfair.className} text-sm md:text-base text-[#5A5349] leading-[2.05] mb-10 px-2`}>
                                We are delighted to invite you to celebrate the beginning of our forever as we exchange vows surrounded by our loved ones. Your presence will make our special day even more memorable.
                            </p>
                            <div className={`${playfair.className} text-[1.6rem] md:text-3xl italic text-[#214A3B] mb-10 leading-snug`}>
                                Wednesday, 2<sup className="text-sm">nd</sup> December <br /> 2026
                            </div>
                            <p className={`${playfair.className} text-sm md:text-base text-[#5A5349] leading-[2.05] mb-10 px-2`}>
                                <span className="text-[#2C3B2A] font-medium">Together with our families</span> request the honour of your presence at the celebration of our marriage.
                            </p>
                            <div className="w-full max-w-[250px] h-[1px] bg-gradient-to-r from-transparent via-[#C19A5B] to-transparent mb-10 opacity-60"></div>
                            <div className="mb-4">
                                <h4 className="text-[15px] md:text-sm font-bold tracking-[0.25em] text-[#1E3F20] uppercase mb-2.5">HOTEL SUEEN NATURE</h4>
                                <p className="text-[11px] md:text-[15px] tracking-[0.25em] uppercase text-[#7A7369] font-medium">BADURALIYA, SRI LANKA</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ======= 4. COUNTDOWN SECTION ======= */}
                    <ScrollReveal className="w-full max-w-md flex flex-col items-center mt-4 mb-20 text-center px-2">
                        <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mb-3">
                            The Big Day Awaits
                        </span>
                        <h3 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#214A3B] mb-6`}>
                            Counting Down
                        </h3>
                        <div className="flex items-center justify-center w-full max-w-[120px] mb-10 opacity-60">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                            <div className="w-2 h-2 rotate-45 bg-[#C19A5B] mx-3"></div>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                        </div>

                        <div className="flex items-center justify-between gap-2.5 w-full">
                            <TimeBox value={timeLeft.days} label="Days" />
                            <TimeBox value={timeLeft.hours} label="Hours" />
                            <TimeBox value={timeLeft.minutes} label="Mins" />
                            <TimeBox value={timeLeft.seconds} label="Secs" />
                        </div>
                    </ScrollReveal>

                    {/* ======= 5. PORUWA CEREMONY CARD ======= */}
                    <ScrollReveal className="w-full max-w-md flex flex-col items-center text-center px-2">
                        <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mt-6 mb-3">
                            Celebrate With Us
                        </span>
                        <h3 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#214A3B] mb-6`}>
                            Wedding Events
                        </h3>
                        <div className="flex items-center justify-center w-full max-w-[120px] mb-10 opacity-60">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                            <div className="w-2 h-2 rotate-45 bg-[#C19A5B] mx-3"></div>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                        </div>

                        <div className="w-full max-w-md bg-[#F4EEDC]/40 backdrop-blur-md rounded-[2rem] border-[1.5px] border-[#C19A5B]/40 p-2 md:p-2.5 shadow-sm mt-4">
                            <div className="flex flex-col items-center rounded-[1.6rem] border-[1px] border-[#C19A5B]/60 pt-6 pb-6 px-6 relative overflow-hidden h-full bg-transparent text-center">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#214A3B] border-[2px] border-[#C19A5B] flex items-center justify-center text-[#F4EEDC] mb-4 shadow-sm">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3L2 9h20L12 3zm0 2.5l5 3H7l5-3zM5 11v8h2v-8H5zm4 0v8h2v-8H9zm4 0v8h2v-8h-2zm4 0v8h2v-8h-2zM2 20h20v2H2v-2z" />
                                    </svg>
                                </div>
                                <h4 className={`${playfair.className} text-xl md:text-2xl font-bold tracking-[0.1em] text-[#214A3B] uppercase mb-4`}>
                                    Poruwa Ceremony
                                </h4>
                                <div className="flex flex-col items-center justify-center gap-2.5 text-[#403635] w-full mt-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="text-[#C19A5B] flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <div className={`${playfair.className} flex items-baseline font-semibold tracking-widest uppercase`}>
                                            <span className="text-[16px] md:text-[18px]">2</span>
                                            <span className="text-[9px] md:text-[10px] ml-[1px]">ND</span>
                                            <span className="text-[11px] md:text-xs ml-1.5">December 2026</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="text-[#C19A5B] flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span className={`${playfair.className} text-[11px] md:text-xs font-semibold tracking-widest uppercase`}>
                                            9:00 AM
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 text-center">
                                        <svg className="text-[#C19A5B] flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span className={`${playfair.className} text-[11px] md:text-xs font-semibold tracking-widest uppercase leading-relaxed max-w-[220px]`}>
                                            Hotel Sueen Nature
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ======= 6. SAVE THE DATE BUTTON ======= */}
                    <ScrollReveal className="w-full max-w-md px-2" delay={0.2}>
                      <button
                        onClick={handleSaveTheDate}
                        className="w-full bg-[#FCF9F3]/90 backdrop-blur-md rounded-[1.8rem] border-[1px] border-[#C19A5B]/40 p-4 mt-6 shadow-sm flex items-center justify-between hover:bg-[#F4EEDC] hover:border-[#C19A5B]/70 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#214A3B] flex items-center justify-center text-[#F4EEDC] flex-shrink-0 shadow-inner">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    <path d="M9 16l2 2 4-4"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className={`${playfair.className} text-[#214A3B] text-[1.1rem] md:text-[1.25rem] font-bold tracking-wide`}>
                                    Save the Date
                                </span>
                                <span className={`${playfair.className} text-[#8B7D6B] text-[11px] md:text-[12px] tracking-wider mt-0.5 italic font-medium`}>
                                    Add the wedding to your calendar
                                </span>
                            </div>
                        </div>
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#214A3B] mr-1 flex-shrink-0 group-hover:bg-[#E3DBCB] transition-colors duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </div>
                      </button>
                    </ScrollReveal>

                    {/* ======= 7. GALLERY SECTION ======= */}
                    <div className="w-full max-w-md flex flex-col items-center mt-16 mb-10 text-center px-2">
                        <ScrollReveal>
                            <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mb-3 block">
                                Captured Moments
                            </span>
                            <h3 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#214A3B] mb-6`}>
                                Our Gallery
                            </h3>
                            <div className="flex items-center justify-center w-full max-w-[120px] mb-10 mx-auto opacity-60">
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                                <div className="w-2 h-2 rotate-45 bg-[#C19A5B] mx-3"></div>
                                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                            </div>
                        </ScrollReveal>

                        <div className="w-full flex flex-col gap-3 md:gap-4">
                            <ScrollReveal delay={0.1} className="grid grid-cols-[1.3fr_1fr] gap-3 md:gap-4 w-full">
                                <div className="relative row-span-2 rounded-2xl overflow-hidden shadow-sm group w-full h-full transform-gpu">
                                    <Image src="/images/gallery_1.jpg" alt="Gallery 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group w-full transform-gpu">
                                    <Image src="/images/gallery_2.jpg" alt="Gallery 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group w-full transform-gpu">
                                    <Image src="/images/gallery_3.jpg" alt="Gallery 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.2} className="grid grid-cols-[1.3fr_1fr] gap-3 md:gap-4 w-full mt-1 md:mt-2">
                                <div className="relative row-span-2 rounded-2xl overflow-hidden shadow-sm group w-full h-full transform-gpu">
                                    <Image src="/images/gallery_4.jpg" alt="Gallery 4" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group w-full transform-gpu">
                                    <Image src="/images/gallery_5.jpg" alt="Gallery 5" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group w-full transform-gpu">
                                    <Image src="/images/gallery_6.jpg" alt="Gallery 6" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform backface-hidden transform-gpu" />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* ======= 8. WEDDING VENUE SECTION ======= */}
                    <ScrollReveal className="w-full max-w-md flex flex-col items-center mt-12 mb-10 text-center px-2">
                        <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mb-3">
                            The Setting
                        </span>
                        <h3 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#214A3B] mb-6`}>
                            Wedding Venue
                        </h3>
                        
                        <div className="flex items-center justify-center w-full max-w-[120px] mb-8 opacity-60">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                            <div className="w-2 h-2 rotate-45 bg-[#C19A5B] mx-3"></div>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                        </div>

                        <div className="w-full bg-[#F4EEDC]/40 backdrop-blur-md rounded-[2rem] border-[1.5px] border-[#C19A5B]/40 p-2 md:p-2.5 shadow-sm">
                            <div className="flex flex-col items-center rounded-[1.6rem] border-[1px] border-[#C19A5B]/60 pt-8 pb-8 px-6 relative overflow-hidden h-full bg-transparent text-center">
                                
                                <div className="w-12 h-12 rounded-full border-[1.5px] border-[#214A3B] flex items-center justify-center text-[#214A3B] mb-4">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>

                                <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mb-2">Venue</span>
                                <h4 className={`${playfair.className} text-xl md:text-2xl font-bold text-[#214A3B] mb-2`}>
                                    Hotel Sueen Nature
                                </h4>
                                <p className="text-xs md:text-sm text-[#5A5349] font-medium tracking-wide">
                                    Baduraliya, Sri Lanka
                                </p>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="w-full mt-4 rounded-[1.5rem] overflow-hidden shadow-sm border-[1.5px] border-[#C19A5B]/40 bg-[#FDFBF7] p-1.5">
                            <div className="w-full h-[250px] md:h-[300px] rounded-[1.2rem] overflow-hidden transform-gpu">
                                <iframe 
                                    src="https://maps.google.com/maps?q=Baduraliya,+Sri+Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true}
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        <a 
                            href="https://maps.app.goo.gl/DEzCD63gGXr7fJ2DA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 border border-[#214A3B] text-[#214A3B] px-10 py-3 rounded-full uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold hover:bg-[#214A3B] hover:text-white transition-all duration-500 ease-in-out backdrop-blur-sm bg-transparent shadow-sm flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            View on Map
                        </a>

                    </ScrollReveal>

                    {/* ======= 9. RSVP SECTION ======= */}
                    <ScrollReveal className="w-full max-w-md flex flex-col items-center mt-12 mb-24 text-center px-2 relative">
                        
                        {/* Language Toggle */}
                        <div className="absolute top-0 right-4 flex items-center bg-[#F4EEDC]/80 border border-[#C19A5B]/40 rounded-full p-1 shadow-sm z-10 backdrop-blur-md">
                            <button 
                              onClick={() => setRsvpLang('en')}
                              className={`px-3 py-1 text-[10px] md:text-[10px] font-bold uppercase rounded-full transition-all duration-300 ${rsvpLang === 'en' ? 'bg-[#214A3B] text-white shadow-sm' : 'text-[#8B7D6B] hover:text-[#214A3B]'}`}
                            >
                              EN
                            </button>
                            <button 
                              onClick={() => setRsvpLang('si')}
                              className={`px-3 py-1 text-[10px] md:text-[10px] font-bold uppercase rounded-full transition-all duration-300 ${rsvpLang === 'si' ? 'bg-[#214A3B] text-white shadow-sm' : 'text-[#8B7D6B] hover:text-[#214A3B]'}`}
                            >
                              සිං
                            </button>
                        </div>

                        <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8B7D6B] font-semibold mb-3 mt-10 md:mt-8">
                            {rsvpContent[rsvpLang].subtitle}
                        </span>
                        <h3 className={`${playfair.className} text-3xl md:text-4xl font-semibold text-[#214A3B] mb-6`}>
                            {rsvpContent[rsvpLang].title}
                        </h3>
                        
                        <div className="flex items-center justify-center w-full max-w-[120px] mb-8 opacity-60">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]"></div>
                            <div className="w-2 h-2 rotate-45 bg-[#C19A5B] mx-3"></div>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]"></div>
                        </div>

                        <p className={`${playfair.className} text-[14px] md:text-[15px] text-[#5A5349] leading-relaxed mb-6 px-4`}>
                            {rsvpContent[rsvpLang].desc}
                        </p>
                        
                        <p className={`text-[12px] md:text-[11px] font-bold text-[#214A3B] uppercase tracking-widest mb-8 ${playfair.className}`}>
                            {rsvpContent[rsvpLang].deadline}
                        </p>

                        <div className="w-full bg-[#F4EEDC]/40 backdrop-blur-md rounded-[2rem] border-[1.5px] border-[#C19A5B]/40 p-2 md:p-2.5 shadow-sm">
                            <form onSubmit={handleRSVPSubmit} className="flex flex-col rounded-[1.6rem] border-[1px] border-[#C19A5B]/60 p-5 md:p-7 relative overflow-hidden h-full bg-transparent text-left">
                                
                                {rsvpStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-14 h-14 rounded-full bg-[#214A3B] text-white flex items-center justify-center mb-4 shadow-md">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <h4 className={`${playfair.className} text-xl md:text-2xl font-bold text-[#214A3B] mb-2`}>
                                            {rsvpContent[rsvpLang].success}
                                        </h4>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6 w-full">
                                            <label className={`block text-[10px] md:text-xs font-bold text-[#1E3F20] mb-2 uppercase tracking-wider ${playfair.className}`}>
                                                {rsvpContent[rsvpLang].nameLabel}
                                            </label>
                                            <input 
                                                type="text" 
                                                required
                                                value={rsvpName}
                                                onChange={(e) => setRsvpName(e.target.value)}
                                                placeholder={rsvpContent[rsvpLang].namePlaceholder}
                                                className={`w-full bg-[#FDFBF7]/80 border border-[#C19A5B]/60 rounded-xl px-4 py-3 text-sm text-[#403635] focus:outline-none focus:ring-1 focus:ring-[#214A3B] focus:border-[#214A3B] transition-all placeholder-[#8B7D6B]/60 ${playfair.className}`}
                                            />
                                        </div>

                                        <div className="mb-6 w-full">
                                            <label className={`block text-[10px] md:text-xs font-bold text-[#1E3F20] mb-3 uppercase tracking-wider ${playfair.className}`}>
                                                {rsvpContent[rsvpLang].attendLabel}
                                            </label>
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setRsvpAttending(true)}
                                                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border ${playfair.className} ${rsvpAttending === true ? 'bg-[#214A3B] text-[#FDFBF7] border-[#214A3B] shadow-md' : 'bg-transparent text-[#5A5349] border-[#C19A5B]/60 hover:border-[#214A3B] hover:text-[#214A3B]'}`}
                                                >
                                                    {rsvpContent[rsvpLang].accept}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRsvpAttending(false)}
                                                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border ${playfair.className} ${rsvpAttending === false ? 'bg-[#214A3B] text-[#FDFBF7] border-[#214A3B] shadow-md' : 'bg-transparent text-[#5A5349] border-[#C19A5B]/60 hover:border-[#214A3B] hover:text-[#214A3B]'}`}
                                                >
                                                    {rsvpContent[rsvpLang].decline}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {rsvpAttending === true && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mb-8 w-full overflow-hidden"
                                                >
                                                    <label className={`block text-[10px] md:text-xs font-bold text-[#1E3F20] mb-3 uppercase tracking-wider mt-2 ${playfair.className}`}>
                                                        {rsvpContent[rsvpLang].guestLabel}
                                                    </label>
                                                    <div className="flex items-center justify-between px-6 py-2.5 bg-[#FDFBF7]/80 border border-[#C19A5B]/60 rounded-xl">
                                                        <button
                                                            type="button"
                                                            onClick={() => rsvpGuests > 1 && setRsvpGuests(p => p - 1)}
                                                            disabled={rsvpGuests <= 1}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#C19A5B] text-[#214A3B] disabled:opacity-30 hover:bg-[#C19A5B] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                        </button>
                                                        <span className={`${playfair.className} text-xl md:text-2xl text-[#1E3F20] font-semibold w-10 text-center`}>
                                                            {rsvpGuests}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => rsvpGuests < 8 && setRsvpGuests(p => p + 1)}
                                                            disabled={rsvpGuests >= 8}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#C19A5B] text-[#214A3B] disabled:opacity-30 hover:bg-[#C19A5B] hover:text-white transition-all shadow-sm"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button 
                                            type="submit"
                                            disabled={rsvpStatus === 'loading'}
                                            className={`w-full flex items-center justify-center gap-2 border-[1.5px] border-[#214A3B] px-6 py-3.5 rounded-full uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold transition-all duration-500 ease-in-out backdrop-blur-sm ${playfair.className} ${rsvpStatus === 'loading' ? 'bg-[#214A3B]/50 text-white cursor-not-allowed' : 'bg-transparent text-[#214A3B] hover:bg-[#214A3B] hover:text-white shadow-sm cursor-pointer'}`}
                                        >
                                            {rsvpStatus === 'loading' ? (
                                                <>
                                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                  </svg>
                                                  {rsvpContent[rsvpLang].sending}
                                                </>
                                            ) : (
                                                <>
                                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <line x1="22" y1="2" x2="11" y2="13"></line>
                                                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                  </svg>
                                                  {rsvpContent[rsvpLang].button}
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </ScrollReveal>

                </div>
                
                {/* ======= 10. CLOSING & DEVELOPER FOOTER ======= */}
                <div className="relative w-full flex flex-col items-center pt-24 pb-12 overflow-hidden z-20 bg-[#0D1A11]">
                    
                    {/* Soft Matte Gradient Overlay for velvet texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1A3322]/80 to-transparent pointer-events-none"></div>

                    {/* BIG Rotating Mandala at the VERY BOTTOM (Half Visible) */}
                    <div className="absolute bottom-0 left-[54%] -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.11] pointer-events-none z-0">
                        <div className="relative w-full h-full animate-[spin_60s_linear_infinite] origin-[48%_52%]">
                            <Image src="/images/mandala.png" alt="Mandala" fill className="object-contain" />
                        </div>
                    </div>

                    <ScrollReveal className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-md">
                        
                        <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C19A5B] font-semibold mb-6">
                            Save The Date
                        </span>

                        <h2 className={`${playfair.className} text-4xl md:text-5xl text-[#FCE6BB] font-semibold tracking-widest mb-6`}>
                            02 . 12 . 26
                        </h2>

                        <p className={`${playfair.className} text-sm md:text-base text-[#EFE9DF] italic mb-10 opacity-90`}>
                            Thank you for being part of our special day.
                        </p>

                        {/* Heart Divider */}
                        <div className="flex items-center justify-center w-full max-w-[200px] mb-10">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C19A5B]/60"></div>
                            <div className="mx-4 text-[#C19A5B]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C19A5B]/60"></div>
                        </div>

                        <div className={`flex items-center justify-center text-[#FCE6BB] mb-8 ${playfair.className}`}>
                            <h1 className="text-3xl md:text-4xl italic font-semibold tracking-wide drop-shadow-md">Rohitha</h1>
                            <span className="text-2xl md:text-3xl text-[#C19A5B] mx-3 font-normal">&</span>
                            <h1 className="text-3xl md:text-4xl italic font-semibold tracking-wide drop-shadow-md">Sasanjalee</h1>
                        </div>

                        <h4 className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-[#C19A5B] uppercase mb-16">
                            HOTEL SUEEN NATURE
                        </h4>

                        {/* Developer Details */}
                        <div className="mt-8 pt-6 border-t border-[#C19A5B]/20 w-full flex flex-col items-center justify-center gap-1.5 opacity-80">
                            <span className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-[#EFE9DF]">
                                Developed By
                            </span>
                            
                            {/* මෙතන ඔයාගේ නම දෙන්න */}
                            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] text-[#C19A5B]">
                                Vidathma De Silva
                            </span>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C19A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                
                                {/* මෙතන ඔයාගේ Number එක දෙන්න */}
                                <a href="tel:+94761702946" className="text-[9px] md:text-[10px] text-[#EFE9DF] tracking-wider hover:text-[#C19A5B] transition-colors">
                                    +94 76 170 2946
                                </a>
                            </div>
                        </div>

                    </ScrollReveal>
                </div>

            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}