import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5050;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 SUMMARIZE
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "'text' is required." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content:
            "Create a highly readable, exam-friendly summary in clear point form. IMPORTANT: include ALL major points from the source text; do not skip any key idea. Use this exact structure only:\n1) Core Idea: one short line.\n2) Main Points: 8-12 bullets for complete coverage. Each bullet format: 'Point - short explanation - simple example'.\n3) Exam Points: 5-8 bullets that are most likely to be asked in exams (definitions, causes, steps, differences, outcomes, formulas/dates if present).\n4) Key Terms: 4-8 bullets with very short meanings.\n5) Quick Revision: 2 one-line recap bullets.\nKeep sentences short and simple. No long paragraphs.",
        },
        { role: "user", content: text },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to summarize." });
  }
});

// 🔹 QUIZ
app.post("/quiz", async (req, res) => {
  try {
    const { text, difficulty = "normal" } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "'text' is required." });
    }

    const difficultyInstruction =
      difficulty === "hard"
        ? "Make this quiz HARD: include multi-step reasoning, subtle distractors, and concept-integration across sections. Avoid basic recall-only questions."
        : "Use mixed difficulty with clear, fair distractors.";

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            `Create a coverage-focused multiple-choice quiz from the full text. First identify all major parts/sections (beginning, middle, end, and distinct subtopics), then generate one question per major part so the quiz represents the entire text. Return 6 to 10 questions depending on content length and section count. Avoid repeating the same idea. ${difficultyInstruction} Return ONLY valid JSON as an array. Each item must be: {\"q\":\"question\",\"opts\":[\"option A\",\"option B\",\"option C\",\"option D\"],\"ans\":0,\"explanation\":\"short reason\",\"sourcePart\":\"which part/section this came from\"}. 'ans' must be the 0-based index of the correct option.`,
        },
        { role: "user", content: text },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to generate quiz." });
  }
});

// 🔹 ASK
app.post("/ask", async (req, res) => {
  try {
    const { text, question } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "'text' is required." });
    }
    if (!question?.trim()) {
      return res.status(400).json({ error: "'question' is required for ask mode." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 180,
      messages: [
        {
          role: "system",
          content:
            "Answer based only on the given text. Make it exam-friendly and clear for students. Use this format exactly: 'Direct Answer:' (40-60 words), 'Main Points:' (exactly 3 bullets). For each bullet, include a short explanation and a mini example. Finish with 'Conclusion:' (one short sentence). Keep wording simple.",
        },
        {
          role: "user",
          content: `Text: ${text}\nQuestion: ${question}`,
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to answer question." });
  }
});

// 🔹 STRUCTURED ESSAY QUESTIONS
app.post("/essay", async (req, res) => {
  try {
    const { text, difficulty = "normal" } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "'text' is required." });
    }

    const difficultyInstruction =
      difficulty === "hard"
        ? "Make the questions harder: analytical, comparative, and multi-step, requiring deeper reasoning across multiple parts of the text."
        : "Keep questions balanced and exam-friendly.";

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            `Generate 4 to 6 structured essay questions from the text, covering all major sections. ${difficultyInstruction} Return ONLY valid JSON as an array. Each item must be: {\"q\":\"essay question\",\"structure\":[\"Introduction\",\"Body Point 1\",\"Body Point 2\",\"Conclusion\"],\"keyConcepts\":[\"concept 1\",\"concept 2\"],\"sourcePart\":\"section or part used\"}`,
        },
        { role: "user", content: text },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to generate essay questions." });
  }
});

// 🔹 ESSAY ANSWER (ON DEMAND)
app.post("/essay-answer", async (req, res) => {
  try {
    const { text, essayQuestion } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "'text' is required." });
    }
    if (!essayQuestion?.trim()) {
      return res.status(400).json({ error: "'essayQuestion' is required." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "Write an exam-friendly answer using only the provided text and make it easy to understand. Keep it short (100-150 words). Use this exact structure: 'Introduction' (1 short line), 'Main Points' (3 numbered points). Each main point must include one short explanation and one simple example. End with 'Conclusion' (1 short line). No extra sections.",
        },
        {
          role: "user",
          content: `Source text:\n${text}\n\nEssay question:\n${essayQuestion}`,
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to generate essay answer." });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});