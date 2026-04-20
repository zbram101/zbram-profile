import { describe, expect, it } from "vitest";
import {
  getContactProfile,
  getKeyAchievements,
  getRoleFit,
  getSkillInventory,
  getWorkHistory,
  searchProfileKnowledge,
  workExperience,
} from "./profile";

describe("profile knowledge helpers", () => {
  it("returns ranked knowledge results and respects the requested limit", () => {
    const results = searchProfileKnowledge("inventory decision support", 3);

    expect(results).toHaveLength(3);
    expect(
      results.some((result) =>
        `${result.title} ${result.excerpt}`.toLowerCase().includes("inventory")
      )
    ).toBe(true);
  });

  it("filters work history by company keyword", () => {
    const roles = getWorkHistory("Thermo", 5);

    expect(roles).toHaveLength(1);
    expect(roles[0].company).toBe("Thermo Fisher Scientific");
  });

  it("clamps large work history limits to available roles", () => {
    const roles = getWorkHistory("", 999);

    expect(roles).toHaveLength(workExperience.length);
  });

  it("returns focused skills for AI queries", () => {
    const focused = getSkillInventory("AI", 3);

    expect(focused).toHaveLength(1);
    expect(focused[0].title).toBe("AI Systems");
    expect(focused[0].skills).toHaveLength(3);
    expect(focused[0].skills[0]).toBe("OpenAI APIs");
  });

  it("filters achievements by theme", () => {
    const highlights = getKeyAchievements("mcp", 5);

    expect(highlights.length).toBeGreaterThan(0);
    expect(highlights.every((item) => `${item.label} ${item.detail}`.toLowerCase().includes("mcp"))).toBe(true);
  });

  it("maps role-fit summaries for director and IT engineering", () => {
    const director = getRoleFit("Director of Engineering");
    const itEngineering = getRoleFit("Senior Manager, IT Engineering");

    expect(director.fit.toLowerCase()).toContain("director");
    expect(director.supportingEvidence).toHaveLength(3);
    expect(itEngineering.fit.toLowerCase()).toContain("it");
  });

  it("returns contact guidance based on requested channel", () => {
    const emailProfile = getContactProfile("email");

    expect(emailProfile.email).toContain("@");
    expect(emailProfile.preferredAction.toLowerCase()).toContain("email");
  });
});
