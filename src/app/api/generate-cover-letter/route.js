import OpenAI from "openai";

export async function POST(req) {
    try {
        const { name, skills, jobTitle, companyName } = await req.json();

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `Write a professional cover letter for ${name}, highlighting their skills (${skills}) and suitability for the role of ${jobTitle} at ${companyName}, help fit it in less than one page and keep it short. Do not include header information at the top, just start off with Dear Hiring Team and no need for placeholders that the user has to input in the generated cover letter.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: "user", content: prompt },
            ],
        });

        const coverLetter = response.choices[0]?.message?.content?.trim();
        return new Response(JSON.stringify({ coverLetter }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error generating cover letter:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate cover letter." }),
            { status: 500 }
        );
    }
}
