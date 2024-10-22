"use client";

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Music, Stars, Scroll } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface House {
  name: string
  description: string
  color: string
  image: string
  prophecy: string
  element: string
  traits: string[]
}

interface RitualQuestion {
  question: string
  options: string[]
  trait: string
}

const houses: House[] = [
  {
    name: "Gryffindor",
    description: "Where dwell the brave at heart",
    color: "from-red-600 to-yellow-500",
    image: "/Gryffindor.jpeg",
    prophecy: "Through flames of courage, your destiny burns bright. The lion's path beckons, through darkness to light.",
    element: "Fire",
    traits: ["courage", "determination", "chivalry"]
  },
  {
    name: "Hufflepuff",
    description: "Where loyalty flourishes and justice reigns supreme",
    color: "from-yellow-400 to-black",
    image: "/Hufflepuff.jpeg",
    prophecy: "In earth's embrace, your loyalty blooms. The badger's wisdom guides through ancient rooms.",
    element: "Earth",
    traits: ["loyalty", "dedication", "fairness"]
  },
  {
    name: "Ravenclaw",
    description: "Where those of wit and learning will always find their kind",
    color: "from-blue-600 to-gray-300",
    image: "/Ravenclaw.jpeg",
    prophecy: "On wings of wisdom, your mind takes flight. The eagle's vision pierces the night.",
    element: "Air",
    traits: ["wisdom", "creativity", "intellect"]
  },
  {
    name: "Slytherin",
    description: "You'll make your real friends",
    color: "from-green-600 to-gray-400",
    image: "/Slytherin.jpeg",
    prophecy: "Through depths of cunning, your ambition gleams. The serpent's path leads to forgotten dreams.",
    element: "Water",
    traits: ["ambition", "cunning", "resourcefulness"]
  }
]

  

const ritualQuestions: RitualQuestion[] = [
  {
    question: "When faced with an ancient door sealed by magic, do you...",
    options: [
      "Break it down with pure force",
      "Research its history first",
      "Look for hidden mechanisms",
      "Try to befriend the guardian"
    ],
    trait: "approach"
  },
  {
    question: "Which magical element calls to your soul?",
    options: [
      "The eternal flame",
      "The whispers of wind",
      "The depths of water",
      "The strength of earth"
    ],
    trait: "element"
  },
  {
    question: "In your recurring dreams, you find yourself...",
    options: [
      "Flying through storm clouds",
      "Exploring ancient libraries",
      "Leading others through darkness",
      "Healing magical creatures"
    ],
    trait: "dreams"
  }
]

const magicalTitles = [
  "The Mystic Sage",
  "The Arcane Warrior",
  "The Spellweaver",
  "The Dragon Whisperer",
  "The Storm Caller",
  "The Ancient Guardian"
]

export default function MagicalRealmSorter() {
    const [name, setName] = useState("")
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
    const  [answers, setAnswers] = useState<Record<string, string>>({})
    const [allocatedHouse, setAllocatedHouse] = useState<House | null>(null)
    const [magicalTitle, setMagicalTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [particles, setParticles] = useState<Array<{
      id: number
      x: number
      y: number
      color: string
      size: number
    }>>([])
    const [isMusicPlaying, setIsMusicPlaying] = useState(false)
    const [showProphecy, setShowProphecy] = useState(false)
    const [ritualStep, setRitualStep] = useState(0)
    const [ritualEnergy, setRitualEnergy] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
  
    // Initialize audio and particle system
    useEffect(() => {
      if (typeof window !== 'undefined') {
        audioRef.current = new Audio("/harry_potter_theme.mp3")
        audioRef.current.loop = true
  
        const createParticle = () => ({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: ['yellow', 'purple', 'blue'][Math.floor(Math.random() * 3)],
          size: Math.random() * 4 + 2
        })
  
        const interval = setInterval(() => {
          setParticles(prev => [...prev.slice(-30), createParticle()])
        }, 100)

       
        return () => {
          clearInterval(interval)
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
          }
        }
      }
    }, [])
  
    // Ritual energy effect
    useEffect(() => {
      if (currentQuestionIndex >= 0) {
        const interval = setInterval(() => {
          setRitualEnergy(prev => (prev + 1) % 100)
        }, 50)
        return () => clearInterval(interval)
      }
    }, [currentQuestionIndex])
  
    const toggleMusic = () => {
      if (!audioRef.current) return
      
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err)
        })
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  
    const beginRitual = () => {
      if (name.trim() === "") return
      setCurrentQuestionIndex(0)
      setRitualStep(1)
    }
  
    const handleAnswerSelection = (answer: string) => {
      setAnswers(prev => ({
        ...prev,
        [ritualQuestions[currentQuestionIndex].trait]: answer
      }))
  
      if (currentQuestionIndex < ritualQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        performSorting()
      }
    }
  
    // Update the performSorting function to use the answers
const performSorting = () => {
  setIsLoading(true)
  setRitualStep(2)

  setTimeout(() => {
    setRitualStep(3)
    setTimeout(() => {
      // Use answers to determine house
      const housePoints = houses.map(house => {
        let score = 0;
        
        // Example scoring based on answers
        if (answers.approach?.includes("force")) score += house.name === "Gryffindor" ? 2 : 0;
        if (answers.approach?.includes("research")) score += house.name === "Ravenclaw" ? 2 : 0;
        if (answers.approach?.includes("hidden")) score += house.name === "Slytherin" ? 2 : 0;
        if (answers.approach?.includes("befriend")) score += house.name === "Hufflepuff" ? 2 : 0;

        if (answers.element?.includes("flame")) score += house.element === "Fire" ? 2 : 0;
        if (answers.element?.includes("wind")) score += house.element === "Air" ? 2 : 0;
        if (answers.element?.includes("water")) score += house.element === "Water" ? 2 : 0;
        if (answers.element?.includes("earth")) score += house.element === "Earth" ? 2 : 0;

        return { house, score };
      });

      // Sort houses by score and get the highest scoring house
      const selectedHouse = housePoints.sort((a, b) => b.score - a.score)[0].house;
      
      setAllocatedHouse(selectedHouse)
      setMagicalTitle(magicalTitles[Math.floor(Math.random() * magicalTitles.length)])
      setIsLoading(false)
      setTimeout(() => setShowProphecy(true), 1000)
    }, 2000)
  }, 2000)
}

   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars absolute inset-0" />
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute bg-yellow-300/40 rounded-full blur-sm"
            style={{
              width: particle.size,
              height: particle.size
            }}
            initial={{ opacity: 0, x: particle.x, y: particle.y }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 360 }}
            transition={{ duration: 2 }}
          />
        ))}
      </div>
      


    
          <Card className="w-full max-w-md p-8 bg-gray-800/40 backdrop-blur-md shadow-2xl relative z-10 border border-purple-500/20">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-600 mb-8">
                Potterheads Assemble
              </CardTitle>
            </CardHeader>
    
            <CardContent className="space-y-6 p-0">
              <AnimatePresence mode="wait">
                {currentQuestionIndex === -1 && !allocatedHouse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Input
                      type="text"
                      placeholder="Inscribe thy true name, seeker..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-700/50 text-gray-100 placeholder-gray-400 border-gray-600 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                    />
                  </motion.div>
                )}
    
                {currentQuestionIndex >= 0 && !allocatedHouse && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <div className="text-xl text-purple-300 mb-4 text-center">
                      {ritualQuestions[currentQuestionIndex].question}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {ritualQuestions[currentQuestionIndex].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleAnswerSelection(option)}
                          className="p-3 bg-gray-700/50 rounded-lg text-gray-200 hover:bg-purple-600/50 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
    
                    <motion.div 
                      className="h-1 bg-gray-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${ritualEnergy}%` }}
                      />
                    </motion.div>
                  </motion.div>
                )}
    
                {allocatedHouse && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center"
                  >
                    <motion.img
                      src={allocatedHouse.image}
                      alt={allocatedHouse.name}
                      className="w-32 h-32 mx-auto mb-4 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    />
    
                    <motion.h2 
                      className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${allocatedHouse.color} mb-2`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {allocatedHouse.name}
                    </motion.h2>
    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-lg text-gray-300">{allocatedHouse.description}</p>
                      <p className="mt-2 text-sm text-purple-300">Element: {allocatedHouse.element}</p>
                    </motion.div>
    
                    {showProphecy && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="my-6 p-4 border border-purple-500/30 rounded-lg bg-gray-900/50"
                      >
                        <Scroll className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                        <p className="text-sm italic text-gray-300">{allocatedHouse.prophecy}</p>
                      </motion.div>
                    )}
    
                    <div className="mt-4">
                      <p className="text-xl font-semibold text-yellow-400 mb-2">
                        {name}, the ancient ones name thee:
                      </p>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                        {magicalTitle}
                      </p>
                    </div>
    
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {allocatedHouse.traits.map((trait, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-2 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 hover:bg-gray-600/50 transition-colors duration-300"
                        >
                          #{trait}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
    
              {currentQuestionIndex === -1 && !allocatedHouse && (
                <Button
                onClick={beginRitual}
                disabled={isLoading || !name.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 group"
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  >
                    <Stars className="mr-2" />
                    {ritualStep === 1 ? "Reading the ancient scrolls..." :
                     ritualStep === 2 ? "Consulting the stars..." :
                     "The fates are deciding..."}
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="mr-2 group-hover:animate-pulse" />
                    Wingardium Leviosa
                  </div>
                )}
              </Button>
    
              )}
            </CardContent>
          </Card>
    
          <Button
            onClick={toggleMusic}
            variant="ghost"
            size="icon"
            className="absolute bottom-4 right-4 bg-gray-800/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-300"
            aria-label={isMusicPlaying ? "Pause Music" : "Play Music"}
          >
            <Music className={`transition-colors duration-300 ${isMusicPlaying ? "text-yellow-400" : "text-gray-400"}`} />
          </Button>
        </div>
      )
    }
    