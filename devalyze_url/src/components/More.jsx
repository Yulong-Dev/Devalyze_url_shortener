/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

const More = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardHover = {
    scale: 1.02,
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-[200vh]">
      {/* Hero Section */}
     <motion.main 
  className="min-h-[140vh] flex flex-col justify-center items-center text-center text-white bg-[#212967] py-12 px-4 gap-12"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={containerVariants}
>
  {/* Text Section */}
  <motion.div 
    className="flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto"
    variants={itemVariants}
  >
    <p className="text-sm uppercase tracking-wider">CLICK.SCAN.CONNECT.IT'S THAT SIMPLE</p>
    <h1 className="text-4xl/14 md:text-5xl font-bold font-instrument max-w-[70%]">
      The Devalyze Link & QR Experience
    </h1>
    <p className="text-sm/7 md:text-base font-instrument max-w-[75%] font-light">
      Shorten, scan, and share everything you need to connect with your audience in one simple platform.
    </p>
    <Link
        to="/SignUp"
      className="flex justify-center items-center py-3 px-6 rounded-xl bg-[#4e61f6] hover:bg-blue-700 text-sm font-medium mt-4 font-instrument cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Get started for free
    </Link>
  </motion.div>

  {/* Cards Section */}
  <motion.div 
    className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-8 px-4"
    variants={containerVariants}
  >
    {/* URL Shortener Card */}
    <motion.div 
      className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-xl overflow-hidden shadow-xl flex flex-col"
      variants={itemVariants}
      whileHover={cardHover}
    >
      <div className="h-60 relative flex flex-col justify-center items-center pt-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="flex gap-4 justify-center items-center w-72 h-14 bg-white rounded-2xl shadow-2xl z-30">
          <div className="h-9 w-9 bg-blue-500 rounded-xl flex justify-center items-center">
            <img src="/logos/Link.svg" alt="link icon" className="h-5 w-5" />
          </div>
          <h1 className="text-black text-lg font-medium">
            yourlink.co/<span className="text-blue-500">app</span>
          </h1>
        </div>
        <div className="w-64 h-10 bg-white rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)] z-20 -mt-5"></div>
        <div className="w-56 h-10 bg-white rounded-2xl shadow-[0_10px_25px_rgba(59,130,246,0.3)] z-10 -mt-5"></div>
      </div>

      <div className="bg-[#edeffe] p-6 flex flex-col gap-6 border-t border-[#f2f2f2]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="min-h-9 min-w-9 bg-[#4e61f6] rounded-xl flex justify-center items-center p-2">
              <img src="/logos/Link.svg" alt="link icon" className="h-5 w-5" />
            </div>
            <h1 className="text-[#031f39] font-instrument text-2xl font-semibold">URL Shortener</h1>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none">
            <path d="M20.8386 14.1952C18.5849 12.4247 16.3313 10.4772 14.3551 7.25491V22.7998H10.68V7.25491C8.70373 10.4418 6.41543 12.4247 4.16183 14.1952L1.7002 11.15C4.92459 8.49425 8.11432 5.62606 10.6106 1.19983H14.4244C16.9207 5.62606 20.0758 8.49425 23.3002 11.15L20.8386 14.1952Z" fill="#031F39"/>
          </svg>
        </div>
        <p className="text-[#031f39] font-instrument text-sm/6 text-left">
          Devalyze is a powerful URL shortening solution built to help you create clean, trackable, and branded links that drive engagement. From simplifying long URLs to providing real-time click analytics, Devalyze makes it easy to share smarter and connect faster all from one intuitive platform.
        </p>
      </div>
    </motion.div>

    {/* QR Code Card */}
    <motion.div 
      className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-xl overflow-hidden shadow-xl flex flex-col"
      variants={itemVariants}
      whileHover={cardHover}
    >
      <div className="h-60 flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white">
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute">
            <img src="/logos/Union.svg" alt="Union" className="h-40 w-40" />
          </div>
          <div className="bg-white flex justify-center items-center w-20 h-20 rounded-md shadow-2xl shadow-[#4E61F6] relative z-10 border-[3px] border-[#4E61F6]">
            <img
              src="/logos/Group.svg"
              alt="QR Code"
              className="w-16 h-16 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#edeffe] p-6 flex flex-col gap-6 border-t border-[#f2f2f2]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="min-h-9 min-w-9 rounded-xl flex justify-center items-center border-2 border-[#155eef] p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="47" viewBox="0 0 46 47" fill="none">
  <path d="M14.2403 0.842773H12.9768V2.09892H14.2403V0.842773Z" fill="black"/>
  <path d="M20.5577 0.842773H19.2942V2.09892H20.5577V0.842773Z" fill="black"/>
  <path d="M29.4014 0.842773H28.1379V2.09892H29.4014V0.842773Z" fill="black"/>
  <path d="M18.0309 3.35459V2.09845H16.7674V0.842773H15.5039V2.09845V3.35459V4.61073H16.7674V3.35459H18.0309Z" fill="black"/>
  <path d="M30.6644 2.09839H29.4009V3.35453H30.6644V2.09839Z" fill="black"/>
  <path d="M33.1912 4.61067V5.86682H34.4547V4.61067V3.35453V2.09839H33.1912V3.35453V4.61067Z" fill="black"/>
  <path d="M12.9761 4.61063V3.35449H11.7126V4.61063V5.86678H12.9761V4.61063Z" fill="black"/>
  <path d="M33.1917 0.842773H31.9282V2.09892H33.1917V0.842773Z" fill="black"/>
  <path d="M30.6641 5.86678H31.9276V4.61063V3.35449H30.6641V4.61063V5.86678Z" fill="black"/>
  <path d="M15.5032 5.86694H14.2397V7.12308H15.5032V5.86694Z" fill="black"/>
  <path d="M20.5577 5.86694H19.2942V7.12308H20.5577V5.86694Z" fill="black"/>
  <path d="M14.2403 7.12305H12.9768V8.37919H14.2403V7.12305Z" fill="black"/>
  <path d="M25.6111 7.12305H24.3477V8.37919H25.6111V7.12305Z" fill="black"/>
  <path d="M12.9761 8.37915H11.7126V9.63529H12.9761V8.37915Z" fill="black"/>
  <path d="M26.8741 8.37915H25.6106V9.63529H26.8741V8.37915Z" fill="black"/>
  <path d="M16.7674 9.63486V8.37919V7.12305H15.5039V8.37919V9.63486V10.891H16.7674V9.63486Z" fill="black"/>
  <path d="M19.2945 9.63486V8.37919V7.12305H18.031V8.37919V9.63486V10.891H19.2945V9.63486Z" fill="black"/>
  <path d="M25.6111 9.63477H24.3477V10.8909V12.1471H25.6111V10.8909V9.63477Z" fill="black"/>
  <path d="M10.45 12.147H9.18652V13.4031H10.45V12.147Z" fill="black"/>
  <path d="M25.6106 13.4031V14.6593H26.8741V13.4031V12.147H25.6106V13.4031Z" fill="black"/>
  <path d="M35.7187 12.147H34.4552V10.8909H33.1917V12.147H31.9282V13.4032H33.1917V14.6593H34.4552H35.7187V13.4032V12.147Z" fill="black"/>
  <path d="M1.60626 13.4033H0.342773V14.6595H1.60626V13.4033Z" fill="black"/>
  <path d="M6.65973 13.4031V12.147H5.39624V13.4031V14.6593H6.65973V13.4031Z" fill="black"/>
  <path d="M31.9276 13.4033H30.6641V14.6595H31.9276V13.4033Z" fill="black"/>
  <path d="M38.2459 13.4033H36.9824V14.6595H38.2459V13.4033Z" fill="black"/>
  <path d="M5.39596 15.9154V14.6593H4.13247V13.4031V12.147H2.86898H1.60596V13.4031H2.86898V14.6593V15.9154H4.13247H5.39596Z" fill="black"/>
  <path d="M29.4014 14.6594H28.1379V15.9156H29.4014V14.6594Z" fill="black"/>
  <path d="M42.0358 15.9154V14.6593V13.4031V12.147H40.7723V13.4031H39.5088V14.6593V15.9154V17.1715H40.7723V15.9154H42.0358Z" fill="black"/>
  <path d="M2.86945 15.9155H1.60596V17.1717H2.86945V15.9155Z" fill="black"/>
  <path d="M34.4547 7.12305H33.1912V8.37919H34.4547V7.12305Z" fill="black"/>
  <path d="M33.1917 8.37915H31.9282V9.63529H33.1917V8.37915Z" fill="black"/>
  <path d="M6.65973 15.9155H5.39624V17.1717H6.65973V15.9155Z" fill="black"/>
  <path d="M15.5032 15.9156V14.6594H14.2397V15.9156V17.1717V18.4274H15.5032V17.1717H16.7667V15.9156H15.5032Z" fill="black"/>
  <path d="M36.9823 17.1717V15.9156V14.6594H35.7188V15.9156H34.4553V17.1717H35.7188H36.9823Z" fill="black"/>
  <path d="M4.13336 17.1716H2.86987V18.4278H4.13336V17.1716Z" fill="black"/>
  <path d="M7.92267 18.4274V19.6835H9.18616H10.4492H11.7127H12.9762V18.4274V17.1717H11.7127V18.4274H10.4492H9.18616V17.1717H10.4492V15.9156V14.6594H9.18616H7.92267V15.9156V17.1717H6.65918V18.4274H7.92267Z" fill="black"/>
  <path d="M33.191 18.4273H34.4545V17.1716H33.191H31.9276V18.4273V19.6834H30.6641V20.9396V22.1957H31.9276V20.9396H33.191V19.6834V18.4273Z" fill="black"/>
  <path d="M38.2458 18.4275H36.9827H35.7192V19.6836H36.9827H38.2458V20.9398H39.5092H40.7727V19.6836V18.4275H39.5092H38.2458Z" fill="black"/>
  <path d="M1.60626 19.6836V18.4275H0.342773V19.6836V20.9398H1.60626V19.6836Z" fill="black"/>
  <path d="M15.5032 19.6836H14.2397V20.9397H15.5032V19.6836Z" fill="black"/>
  <path d="M23.0845 19.6835V20.9396H24.348H25.6115H26.8749V19.6835V18.4273H28.1384H29.4015H30.6649V17.1717V15.9155H29.4015V17.1717H28.1384H26.8749V15.9155H25.6115V17.1717V18.4273H24.348V19.6835H23.0845Z" fill="black"/>
  <path d="M34.4547 20.9397H33.1912V22.1959V23.452H34.4547V22.1959H35.7181V20.9397V19.6836H34.4547V20.9397Z" fill="black"/>
  <path d="M14.2396 22.1958V20.9397H12.9761H11.7126V22.1958H12.9761H14.2396Z" fill="black"/>
  <path d="M16.7666 22.1957V23.4519H18.0301V24.708V25.9642V27.2203H19.2936V28.4764H20.5571H21.8206H23.0841V27.2203V25.9642H21.8206V27.2203H20.5571V25.9642H19.2936V24.708V23.4519H20.5571H21.8206V24.708H23.0841V25.9642H24.3476H25.6111V27.2203H26.8745V25.9642H28.138V24.708H26.8745V23.4519H25.6111V24.708H24.3476V23.4519H23.0841V22.1957H21.8206H20.5571V20.9396V19.6834V18.4273H21.8206V19.6834H23.0841V18.4273H24.3476V17.1712V15.915H23.0841V17.1712H21.8206V15.915H23.0841V14.6589H24.3476V13.4027H23.0841V12.1466H21.8206V13.4027H20.5571V12.1466H21.8206V10.8904H23.0841V9.6343V8.37816V7.12202V5.86588H24.3476H25.6111H26.8745V7.12202H28.138V8.37816H29.4015V9.6343H28.138V10.8904H26.8745V12.1466H28.138V13.4027H29.4015V12.1466H30.665V10.8904V9.6343V8.37816V7.12202H29.4006V5.86588V4.60974V3.35453H28.1371V2.09839H26.8736H25.6101H24.3466V3.35453H25.6101V4.61067H24.3466H23.0831H21.8196V3.35453V2.09839H20.5561V3.35453H19.2926H18.0301V4.61067H16.7666V5.86682H18.0301H19.2936V4.61067H20.5571V5.86682H21.8206V7.12296V8.3791H20.5571V9.63524V10.8914H19.2936V12.1475H18.0301V10.8914H16.7666V12.1475H15.5031V10.8914H14.2396V12.1475H12.9761H11.7126V13.4037H12.9761H14.2396H15.5031H16.7666H18.0301V14.6598V15.916V17.1721H16.7666V18.4282V19.6844V20.9405H15.5031V22.1967H16.7666V22.1957ZM19.2936 15.9155V14.6593H20.5571V15.9155V17.1716H19.2936V15.9155ZM18.0301 18.4273H19.2936V19.6834H18.0301V18.4273ZM19.2936 20.9396V22.1957H18.0301V20.9396H19.2936Z" fill="black"/>
  <path d="M28.1382 22.1958H29.4013V20.9397H28.1382H26.8748V22.1958H28.1382Z" fill="black"/>
  <path d="M1.60626 22.1958H0.342773V23.4519H1.60626V22.1958Z" fill="black"/>
  <path d="M14.2403 23.4519H12.9768V24.7081H14.2403V25.9642H15.5038H16.7673V24.7081H15.5038V23.4519V22.1958H14.2403V23.4519Z" fill="black"/>
  <path d="M9.18616 24.7081H10.4492H11.7127V23.452V22.1958H10.4492V20.9397H9.18616H7.92267H6.65918V22.1958H7.92267V23.452H9.18616V24.7081Z" fill="black"/>
  <path d="M29.4014 23.4519H28.1379V24.708H29.4014V23.4519Z" fill="black"/>
  <path d="M34.4545 23.4519V24.7081H33.191V25.9642H34.4545H35.718V27.2204H36.9815V28.4765V29.7327V30.9888V32.2449H35.718V33.5011H34.4545V32.2449H35.718V30.9888H34.4545H33.191H31.9276V32.2449H33.191V33.5011H31.9276V34.7572H30.6641V36.0134V37.2695H31.9276V36.0134H33.191V37.2695H31.9276V38.5257H33.191V39.7818H31.9276V41.0379H33.191V42.2941H34.4545V41.0379H35.718V39.7818H36.9815V41.0379H35.718V42.2941H36.9815V43.5502H38.245V44.8064H36.9815V43.5502H35.718V44.8064H34.4545V46.0625H35.718H36.9815H38.245H39.5085H40.772H42.0355V44.8064H43.299V43.5502H42.0355H40.772V44.8064H39.5085V43.5502H40.772V42.2941H39.5085H38.245V41.0379V39.7818H39.5085V37.2695H40.772H42.0355V36.0134H43.299V34.7572H42.0355H40.772V36.0134H39.5085V34.7572H40.772V33.5011H39.5085H38.245V32.2449V30.9888V29.7327V28.4765H39.5085V29.7327V30.9888H40.772V29.7327V28.4765H42.0355V27.2204H40.772H39.5085H38.245V25.9642H36.9815V24.7081H38.245V25.9642H39.5085V24.7081H40.772V23.4519H39.5085V22.1958H38.245H36.9815H35.718V23.4519H34.4545ZM38.2445 38.5247H34.4541V34.7563H38.2445V38.5247Z" fill="black"/>
  <path d="M31.9276 24.708H33.191V23.4519H31.9276H30.6641V24.708V25.9642H31.9276V24.708Z" fill="black"/>
  <path d="M42.0362 24.708H40.7727V25.9642H42.0362V24.708Z" fill="black"/>
  <path d="M9.18683 25.9641H7.92334V27.2203H9.18683V25.9641Z" fill="black"/>
  <path d="M30.6644 25.9641H29.4009V27.2203H30.6644V25.9641Z" fill="black"/>
  <path d="M25.6111 27.22H24.3477V28.4761H25.6111V27.22Z" fill="black"/>
  <path d="M31.9276 28.4761H33.191V27.22H31.9276H30.6641V28.4761V29.7323H31.9276V28.4761Z" fill="black"/>
  <path d="M34.4547 28.4761H33.1912V29.7322H34.4547V28.4761Z" fill="black"/>
  <path d="M19.2945 29.7322H18.031V30.9883H19.2945V29.7322Z" fill="black"/>
  <path d="M21.8209 29.7322H20.5574V30.9883H21.8209V29.7322Z" fill="black"/>
  <path d="M24.348 29.7322H23.0845V30.9883H24.348V29.7322Z" fill="black"/>
  <path d="M20.5577 30.9883H19.2942V32.2444H20.5577V30.9883Z" fill="black"/>
  <path d="M23.0848 30.9883H21.8213V32.2444H23.0848V30.9883Z" fill="black"/>
  <path d="M6.65976 32.2446V30.9884V29.7323V28.4762V27.22H5.39627H4.13277V25.9643V24.7082H5.39627V25.9643H6.65976H7.92325V24.7082V23.4521H6.65976H5.39627V22.1959V20.9398V19.6836V18.4275H4.13277V19.6836V20.9398V22.1959V23.4521H2.86928H1.60626V24.7082H2.86928V25.9643H1.60626V24.7082H0.342773V25.9643V27.22H1.60626V28.4762H0.342773V29.7323V30.9884V32.2446V33.5007V34.7569H1.60626H2.86928H4.13277V33.5007H2.86928V32.2446H1.60626V30.9884V29.7323H2.86928H4.13277V28.4762H5.39627V29.7323V30.9884V32.2446H4.13277V33.5007H5.39627H6.65976V34.7569H7.92325V33.5007H9.18674V32.2446H7.92325H6.65976Z" fill="black"/>
  <path d="M19.2943 33.5005V32.2444H18.0308V30.9883H16.7673V32.2444H15.5038V30.9883H16.7673V29.7321V28.476V27.2198H15.5038H14.2403V28.476H15.5038V29.7321H14.2403H12.9768H11.7133H10.4499V28.476H11.7133H12.9768V27.2198H14.2403V25.9642H12.9768V24.708H11.7133V25.9642V27.2198H10.4499H9.18683V28.476V29.7321H7.92334V30.9883H9.18683V32.2444H10.4499V30.9883H11.7133V32.2444H12.9768V30.9883H14.2403V32.2444V33.5005H12.9768H11.7133V32.2444H10.4499V33.5005V34.7567H11.7133H12.9768V36.0124H11.7133V37.2685H12.9768V38.5246H14.2403V37.2685V36.0124V34.7567H15.5038V33.5005H16.7673V34.7567H18.0308V33.5005H19.2943Z" fill="black"/>
  <path d="M26.8741 33.5006H28.1376V32.2445H29.4006H30.6641V30.9883V29.7322H29.4006V30.9883H28.1376H26.8741V29.7322H25.6106V30.9883V32.2445H26.8741V33.5006Z" fill="black"/>
  <path d="M31.9276 32.2444H30.6641V33.5005H31.9276V32.2444Z" fill="black"/>
  <path d="M25.6111 33.5005V32.2444H24.3477V33.5005V34.7567H25.6111V33.5005Z" fill="black"/>
  <path d="M30.6644 33.5005H29.4009V34.7566H30.6644V33.5005Z" fill="black"/>
  <path d="M28.1376 36.0125H29.4006V34.7568H28.1376H26.8741H25.6106V36.0125H26.8741H28.1376Z" fill="black"/>
  <path d="M16.7674 36.0125H15.5039V37.2686H16.7674H18.0309V36.0125H16.7674Z" fill="black"/>
  <path d="M36.9827 36.0125H35.7192V37.2686H36.9827V36.0125Z" fill="#155EEF"/>
  <path d="M19.2945 37.2686H18.031V38.5247H19.2945V37.2686Z" fill="black"/>
  <path d="M42.0362 38.5247H40.7727V39.7808H42.0362V38.5247Z" fill="black"/>
  <path d="M12.9761 39.7808H11.7126V41.0369H12.9761V39.7808Z" fill="black"/>
  <path d="M18.0306 39.7808V38.5247H16.7671V39.7808V41.0369V42.2931H18.0306V41.0369V39.7808Z" fill="black"/>
  <path d="M30.6644 39.7808H29.4009V41.0369H30.6644V39.7808Z" fill="black"/>
  <path d="M15.5032 41.0369H14.2397V42.293H15.5032V41.0369Z" fill="black"/>
  <path d="M20.5577 41.0369H19.2942V42.293H20.5577V41.0369Z" fill="black"/>
  <path d="M14.2396 42.2932H12.9761H11.7126V43.5494V44.805H12.9761V43.5494H14.2396V42.2932Z" fill="black"/>
  <path d="M19.2945 42.2932H18.031V43.5494H19.2945V42.2932Z" fill="black"/>
  <path d="M26.875 42.293H28.1385V41.0369H26.875H25.6115V42.293V43.5491H24.348V42.293H23.0845V41.0369H24.348H25.6115V39.7807H26.875H28.1385H29.402V38.5246H28.1385H26.875H25.6115V37.2684V36.0123H24.348V34.7561H23.0845H21.821V33.5H20.5575H19.294V34.7561H18.031V36.0123H19.2945H20.558V37.2684V38.5246V39.7807V41.0369H21.8215V42.293H20.558V43.5491V44.8053H21.8215V43.5491H23.085V44.8053H24.3485H25.612H26.8754V43.5491L26.875 42.293ZM21.821 38.5246H23.0845V37.2684H21.821V36.0123H23.0845V37.2684H24.348V38.5246V39.7807H23.0845H21.821V38.5246Z" fill="black"/>
  <path d="M16.7674 43.5493H15.5039V44.8055H16.7674V43.5493Z" fill="black"/>
  <path d="M15.5032 44.8049H14.2397V46.0611H15.5032V44.8049Z" fill="black"/>
  <path d="M18.0306 44.8049H16.7671V46.0611H18.0306H19.2941H20.5571V44.8049H19.2941H18.0306Z" fill="black"/>
  <path d="M23.0848 44.8049H21.8213V46.0611H23.0848V44.8049Z" fill="black"/>
  <path d="M43.2994 29.7322H42.0359V30.9883V32.2445H43.2994V30.9883V29.7322Z" fill="black"/>
  <path d="M43.2994 25.9642H42.0359V27.2198H43.2994H44.5629V28.476H45.8259V27.2198V25.9642V24.708H44.5629V25.9642H43.2994Z" fill="black"/>
  <path d="M44.5629 24.7081V23.4519H43.2994V22.1958H42.0359V23.4519V24.7081H43.2994H44.5629Z" fill="black"/>
  <path d="M43.2997 17.1716H42.0362H40.7727V18.4273H42.0362V19.6834V20.9396H43.2997V19.6834H44.5632V18.4273H45.8262V17.1716H44.5632H43.2997Z" fill="black"/>
  <path d="M44.5626 32.2444H43.2991V33.5006H44.5626V34.7567V36.0124H45.8256V34.7567V33.5006V32.2444V30.9883H44.5626V32.2444Z" fill="black"/>
  <path d="M31.9276 41.0369H30.6641V42.293H31.9276V41.0369Z" fill="black"/>
  <path d="M35.7188 42.2932H34.4553V43.5494H35.7188V42.2932Z" fill="black"/>
  <path d="M33.1917 43.5494V42.2932H31.9282V43.5494H30.6648V42.2932H29.4013V43.5494H28.1382V44.805H26.8748V46.0612H28.1382H29.4013V44.805H30.6648V46.0612H31.9282V44.805H33.1917H34.4552V43.5494H33.1917Z" fill="black"/>
  <path d="M43.2994 39.7808H42.0359V41.0369H43.2994V39.7808Z" fill="black"/>
  <path d="M44.5626 41.0369H43.2991V42.293H44.5626V43.5492V44.8049H45.8256V43.5492V42.293V41.0369V39.7808H44.5626V41.0369Z" fill="black"/>
  <path d="M10.45 0.842773H0.343018V10.8914H10.4505L10.45 0.842773ZM9.18699 9.63483H1.60651V2.09845H9.18699V9.63483Z" fill="black"/>
  <path d="M7.92384 3.35449H2.86987V8.37859H7.92384V3.35449Z" fill="#4E61F6"/>
  <path d="M0.342773 46.326H10.4502V36.2773H0.342773V46.326ZM1.60626 37.5335H9.18674V45.0699H1.60626V37.5335Z" fill="black"/>
  <path d="M7.92384 38.7898H2.86987V43.8139H7.92384V38.7898Z" fill="#4E61F6"/>
  <path d="M35.7192 0.842773V10.8914H45.8267V0.842773H35.7192ZM44.5632 9.63483H36.9827V2.09845H44.5632V9.63483Z" fill="black"/>
  <path d="M43.2991 3.35449H38.2456V8.37859H43.2991V3.35449Z" fill="#4E61F6"/>
</svg>
            </div>
            <h1 className="text-[#031f39] font-instrument text-2xl font-semibold">QR Codes</h1>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 24" fill="none">
            <path d="M20.8386 14.1952C18.5849 12.4247 16.3313 10.4772 14.3551 7.25491V22.7998H10.68V7.25491C8.70373 10.4418 6.41543 12.4247 4.16183 14.1952L1.7002 11.15C4.92459 8.49425 8.11432 5.62606 10.6106 1.19983H14.4244C16.9207 5.62606 20.0758 8.49425 23.3002 11.15L20.8386 14.1952Z" fill="#031F39"/>
          </svg>
        </div>
        <p className="text-[#031f39] font-instrument text-sm/6 text-left">
          Devalyze is a smart QR code solution built to help you create dynamic, scannable, and branded codes that boost interaction. From linking offline materials to tracking real-time scans, Devalyze makes it easy to connect your audience and measure results all from one seamless platform.
        </p>
      </div>
    </motion.div>
  </motion.div>
</motion.main>

      {/* Stats Section */}
      <motion.div 
        className="min-h-[60vh] w-full bg-gray-100 flex flex-col justify-center items-center text-center gap-12 p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-blue-900 max-w-4xl leading-tight"
          variants={itemVariants}
        >
          Loved by users for making link sharing and QR codes simple and stress-free
        </motion.h1>

        <motion.div 
          className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center"
          variants={containerVariants}
        >
          {[
            { 
              icon: "/logos/contact.png", 
              value: "500k+", 
              text: "Global customers" 
            },
            { 
              icon: "/logos/link.png", 
              value: "256M", 
              text: "Links & QR Codes created monthly" 
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-blue-900 h-60 w-full md:w-64 flex flex-col gap-4 justify-center items-start text-white rounded-lg p-6 shadow-lg"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img src={stat.icon} alt="icon" className="h-14 w-14" />
              <div className="relative inline-block">
                <h1 className="absolute top-1 text-4xl font-bold text-blue-800">{stat.value}</h1>
                <h1 className="relative text-4xl font-bold text-white">{stat.value}</h1>
              </div>
              <p className="text-left">{stat.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default More;