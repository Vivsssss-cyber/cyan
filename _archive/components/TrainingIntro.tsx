import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import imgPaper from '../../assets/a3110fde9eb224d9dd38727b5527b9258d36c33d.png';

export function TrainingIntro() {
  const navigate = useAppNavigate();
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');

  const canProceed = name.trim().length > 0 && lobbyCode.trim().length > 0;

  return (
    <PageTransition>
      <GridBackground className="flex items-stretch min-h-screen">
        <div className="flex w-full min-h-screen">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col justify-center px-16 lg:px-24 py-12">
            <div className="max-w-[514px]">
              <h1
                className="text-[#202326] mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '40px', letterSpacing: '-0.4px' }}
              >
                Welcome Students
              </h1>
              <p
                className="text-[#202326] mb-10"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', lineHeight: 1.6 }}
              >
                We will teach you educational content through interactive games and simulation. We are Cyan Innovations
              </p>

              <div className="space-y-4 mb-10">
                {/* Name input */}
                <div className="space-y-3">
                  <label
                    className="text-[#202326]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600 }}
                  >
                    Enter your name
                  </label>
                  <div
                    className="bg-white/60 rounded-full h-[60px] relative"
                    style={{
                      border: name ? '0.5px solid #2ac2e4' : '0.5px solid #c4c4c4',
                      boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.04), 0px 1px 0px 0px rgba(0,0,0,0.06)',
                    }}
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-full bg-transparent rounded-full px-6 text-[#020618] placeholder:text-[#a0a0a0] outline-none"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-0.18px' }}
                    />
                  </div>
                </div>

                {/* Lobby Code input */}
                <div className="space-y-3">
                  <label
                    className="text-[#202326]"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600 }}
                  >
                    Enter your Lobby Code
                  </label>
                  <div
                    className="bg-white/60 rounded-full h-[60px] relative"
                    style={{
                      border: lobbyCode ? '0.5px solid #2ac2e4' : '0.5px solid #c4c4c4',
                      boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.04), 0px 1px 0px 0px rgba(0,0,0,0.06)',
                    }}
                  >
                    <input
                      type="text"
                      value={lobbyCode}
                      onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                      placeholder="e.g. 54P0UI"
                      className="w-full h-full bg-transparent rounded-full px-6 text-[#020618] placeholder:text-[#a0a0a0] outline-none uppercase tracking-wider"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-0.18px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-[175px]">
                <GameButton
                  onClick={() => {
                    if (canProceed) navigate('/welcome');
                  }}
                  disabled={!canProceed}
                >
                  Enter Game
                </GameButton>
              </div>
            </div>
          </div>

          {/* Right Panel — Crumpled paper with branding */}
          <div className="hidden lg:block w-[50%] relative">
            <div
              className="absolute inset-0 rounded-bl-[32px] rounded-tl-[32px] bg-[#7c7b82] overflow-hidden"
              style={{ border: '2px solid #d2d2d2' }}
            >
              <img
                src={imgPaper.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              {/* Cyan Technology text */}
              <p
                className="absolute text-[#29595e] whitespace-nowrap"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '48px',
                  fontWeight: 800,
                  letterSpacing: '-1.2px',
                  top: '42%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                Cyan Technology
              </p>
              {/* Handwritten labels */}
              {[
                { text: 'business', top: '28%', left: '18%' },
                { text: 'interactive', top: '22%', left: '72%' },
                { text: 'games', top: '65%', left: '18%' },
                { text: 'education', top: '65%', left: '72%' },
              ].map((item) => (
                <p
                  key={item.text}
                  className="absolute text-[#7c7b82] opacity-60 whitespace-nowrap"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '-0.64px',
                    top: item.top,
                    left: item.left,
                  }}
                >
                  {item.text}
                </p>
              ))}
              {/* Decorative arrows */}
              <svg className="absolute opacity-30" style={{ top: '30%', left: '22%', width: '80px', height: '80px' }} viewBox="0 0 80 80" fill="none">
                <path d="M20 60 C25 30, 55 20, 60 20" stroke="#7C7B82" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M55 15 L60 20 L53 22" stroke="#7C7B82" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="absolute opacity-30" style={{ top: '24%', left: '68%', width: '60px', height: '60px' }} viewBox="0 0 60 60" fill="none">
                <path d="M10 50 C20 20, 40 10, 50 15" stroke="#9D9BA7" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M45 10 L50 15 L44 18" stroke="#9D9BA7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="absolute opacity-30" style={{ top: '55%', left: '60%', width: '80px', height: '80px' }} viewBox="0 0 80 80" fill="none">
                <path d="M15 20 C30 25, 50 50, 55 60" stroke="#9D9BA7" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M50 56 L55 60 L58 53" stroke="#9D9BA7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </GridBackground>
    </PageTransition>
  );
}
