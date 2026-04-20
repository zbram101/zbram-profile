import {
  getContactProfile,
  getKeyAchievements,
  getRoleFit,
  getSkillInventory,
  getWorkHistory,
  profile,
  searchProfileKnowledge,
} from "../src/data/profile.js";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

const SYSTEM_PROMPT = [
  `You are the partnership and leadership briefing assistant for ${profile.name}.`,
  "Your audience includes founders, engineering leaders, partnership stakeholders, recruiters, and hiring managers.",
  "Position Bharath as partnership-first, while remaining open to aligned Director, Senior Manager, and Manager roles across AI, automation, and software engineering.",
  "Be concise, factual, and high signal.",
  "Use resume-backed details only. Do not invent metrics, dates, titles, education, or companies.",
  "When helpful, connect technical work to business impact, leadership scope, engineering execution, and stakeholder communication.",
  "If a question is not answered by the available profile data, say that it is not stated in the profile or resume.",
  "Use the tools whenever the user asks for specifics about work history, skills, achievements, partnership fit, role fit, or contact details.",
  "If the user asks for a recommendation, infer carefully from the available evidence and make that inference explicit.",
].join(" ");

const toolDefinitions = [
  {
    type: "function",
    name: "search_profile_knowledge",
    description:
      "Search Bharath Ram's profile for relevant resume-backed context across summary, roles, initiatives, achievements, and skills.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The topic, capability, company, or question to search for.",
        },
        limit: {
          type: "integer",
          description: "Number of results to return between 1 and 8.",
        },
      },
      required: ["query", "limit"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_work_history",
    description:
      "Return Bharath Ram's work history, optionally filtered by company or role keyword.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        company: {
          type: "string",
          description: "A company or role keyword to filter on, or an empty string for all roles.",
        },
        limit: {
          type: "integer",
          description: "Number of roles to return.",
        },
      },
      required: ["company", "limit"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_skill_inventory",
    description:
      "Return skill groups or role-relevant technologies from Bharath Ram's current profile.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        focus: {
          type: "string",
          description: "Skill theme or keyword, or an empty string for the broad stack.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of skills to return per group.",
        },
      },
      required: ["focus", "limit"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_key_achievements",
    description:
      "Return initiative and achievement highlights that support partnership, advisory, and leadership conversations.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          description: "Theme or keyword such as AI, leadership, automation, testing, or data.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of highlights to return.",
        },
      },
      required: ["theme", "limit"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_contact_profile",
    description:
      "Return the best ways to contact Bharath Ram and access public profile details.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Preferred channel such as email, linkedin, phone, or general.",
        },
      },
      required: ["channel"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_role_fit",
    description:
      "Return a tailored fit summary for a target role or leadership scope such as director, senior manager, manager, or IT engineering leadership.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        target_role: {
          type: "string",
          description: "Role target to evaluate.",
        },
      },
      required: ["target_role"],
      additionalProperties: false,
    },
  },
];

const toolHandlers = {
  search_profile_knowledge: ({ query, limit }) => searchProfileKnowledge(query, limit),
  get_work_history: ({ company, limit }) => getWorkHistory(company, limit),
  get_skill_inventory: ({ focus, limit }) => getSkillInventory(focus, limit),
  get_key_achievements: ({ theme, limit }) => getKeyAchievements(theme, limit),
  get_contact_profile: ({ channel }) => getContactProfile(channel),
  get_role_fit: ({ target_role }) => getRoleFit(target_role),
};

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && typeof message.content === "string")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.trim().slice(0, 5000),
    }))
    .filter((message) => message.content.length > 0);
}

function parseArguments(argumentsString) {
  try {
    return JSON.parse(argumentsString || "{}");
  } catch (error) {
    return {};
  }
}

function readTextPart(part) {
  if (!part) {
    return "";
  }

  if (typeof part.text === "string") {
    return part.text;
  }

  if (typeof part.text?.value === "string") {
    return part.text.value;
  }

  if (typeof part.value === "string") {
    return part.value;
  }

  if (typeof part.content === "string") {
    return part.content;
  }

  return "";
}

function extractAssistantText(response) {
  const messageTexts = (response.output || [])
    .filter((item) => item.type === "message" && item.role === "assistant")
    .flatMap((item) => item.content || [])
    .map(readTextPart)
    .filter(Boolean);

  if (messageTexts.length > 0) {
    return messageTexts.join("\n").trim();
  }

  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  return "I could not produce a useful answer from the current profile data.";
}

function mapToolName(name) {
  return name
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

async function createResponse(input) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      instructions: SYSTEM_PROMPT,
      input,
      tools: toolDefinitions,
      parallel_tool_calls: false,
      max_output_tokens: 900,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || "OpenAI request failed.");
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured for this deployment.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const messages = normalizeMessages(body.messages);

    if (messages.length === 0) {
      return res.status(400).json({ error: "A conversation payload is required." });
    }

    const input = [...messages];
    const toolsUsed = [];
    let response;

    for (let iteration = 0; iteration < 6; iteration += 1) {
      response = await createResponse(input);

      if (Array.isArray(response.output)) {
        input.push(...response.output);
      }

      const toolCalls = (response.output || []).filter((item) => item.type === "function_call");

      if (toolCalls.length === 0) {
        break;
      }

      for (const toolCall of toolCalls) {
        const handlerFn = toolHandlers[toolCall.name];
        const toolArguments = parseArguments(toolCall.arguments);

        toolsUsed.push(mapToolName(toolCall.name));

        let toolResult;

        try {
          toolResult = handlerFn ? await handlerFn(toolArguments) : { error: "Tool not found." };
        } catch (toolError) {
          toolResult = {
            error: toolError.message || "Tool execution failed.",
          };
        }

        input.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(toolResult),
        });
      }
    }

    const text = extractAssistantText(response);
    const uniqueTools = [...new Set(toolsUsed)];

    return res.status(200).json({
      text,
      toolsUsed: uniqueTools,
      model: DEFAULT_MODEL,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "The assistant could not complete the request.",
    });
  }
}
