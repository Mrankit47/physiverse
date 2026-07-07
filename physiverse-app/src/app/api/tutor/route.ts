import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Physiverse AI Tutor — an expert physics teacher powered by artificial intelligence. Your role is to:

1. **Explain Concepts**: Break down complex physics topics into clear, intuitive explanations with real-world analogies.
2. **Solve Problems**: Provide step-by-step solutions showing all work, formulas used, and units.
3. **Generate Quizzes**: Create engaging multiple-choice questions with explanations for each answer.
4. **Study Recommendations**: Suggest learning paths, resources, and practice strategies.

Guidelines:
- Use proper physics notation and SI units
- Include relevant formulas
- Give real-world examples when possible
- Be encouraging and supportive
- If a question is unclear, ask for clarification
- Format responses with clear headers, bullet points, and numbered steps`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback: provide a mock response
      return NextResponse.json({
        response: getMockResponse(messages[messages.length - 1]?.content || ''),
      });
    }

    // Use Gemini API
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are an AI physics tutor. Here is your system prompt: ' + SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'I understand. I am Physiverse AI Tutor, ready to help with physics concepts, problem solving, quizzes, and study recommendations. How can I help you today?' }] },
        ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Tutor error:', error);
    return NextResponse.json(
      { response: 'I encountered an error processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

function getMockResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('newton') || q.includes('force') || q.includes('f=ma') || q.includes('f = ma')) {
    return `## Newton's Second Law of Motion

**F = ma**

Newton's Second Law states that the net force acting on an object is equal to its mass multiplied by its acceleration.

### Key Points:
- **Force (F)** is measured in Newtons (N)
- **Mass (m)** is measured in kilograms (kg)
- **Acceleration (a)** is measured in meters per second squared (m/s²)

### Example:
A 5 kg object accelerating at 3 m/s²:
F = 5 × 3 = **15 N**

### Real-World Application:
This is why heavier vehicles need more powerful engines — they require greater force to achieve the same acceleration as lighter vehicles.

💡 **Tip**: Try the Projectile Motion simulation to see F=ma in action!`;
  }

  if (q.includes('quiz')) {
    return `## Physics Quick Quiz 🧪

**1.** What is the SI unit of force?
   a) Watt  b) **Newton** ✓  c) Joule  d) Pascal

**2.** Which law states that energy cannot be created or destroyed?
   a) Newton's 2nd Law  b) **Conservation of Energy** ✓  c) Ohm's Law  d) Boyle's Law

**3.** What is the speed of light in vacuum?
   a) 3×10⁶ m/s  b) 3×10⁷ m/s  c) **3×10⁸ m/s** ✓  d) 3×10⁹ m/s

**4.** What particle has a positive charge?
   a) Electron  b) Neutron  c) **Proton** ✓  d) Photon

**5.** What is the formula for kinetic energy?
   a) E = mc²  b) **KE = ½mv²** ✓  c) PE = mgh  d) F = ma

How did you do? Want me to explain any of the answers?`;
  }

  if (q.includes('gravity') || q.includes('gravitation')) {
    return `## Gravity — The Universal Force

Gravity is one of the four fundamental forces of nature. Newton's Law of Universal Gravitation:

**F = G·M·m / r²**

Where:
- G = 6.674 × 10⁻¹¹ N·m²/kg² (gravitational constant)
- M, m = masses of the two objects
- r = distance between their centers

### Key Facts:
- Gravity is always **attractive** (never repulsive)
- It has **infinite range** but weakens with distance
- On Earth's surface: g ≈ 9.8 m/s²
- Einstein described gravity as the **curvature of spacetime**

🚀 Try the Gravity & Orbits simulation to see gravitational force vectors in real-time!`;
  }

  return `Great question! Let me help you with that.

Physics is all about understanding the fundamental laws that govern our universe. Here are some areas I can help you with:

📚 **Concepts**: I can explain any physics topic from classical mechanics to quantum theory
🔢 **Problems**: Share a problem and I'll solve it step-by-step
📝 **Quizzes**: Ask me to "generate a quiz" on any topic
📖 **Study Tips**: I can recommend a learning path tailored to your level

What would you like to explore? Try asking:
- "Explain quantum entanglement"
- "Solve: A ball is thrown upward at 20 m/s..."
- "Generate a quiz on electromagnetism"
- "Study plan for AP Physics"`;
}
