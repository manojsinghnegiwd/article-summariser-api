import { extract } from "@extractus/article-extractor";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
});

export async function POST (Request: Request) {
    const body = await Request.json();
    const { url } = body;

    if (!url) {
        return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
        const page = await extract(url);
    
        if (page) {
            const { title, content } = page;

            const prompt = `Summarise the following article: ${title}\n\n${content}`;

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    }
                ],
                model: 'gpt-3.5-turbo',
            });

            const summary = chatCompletion.choices[0].message.content;

            return Response.json({ title, summary });
        } else {
            return Response.json({ error: "Could not extract article"}, { status: 500 })
        }
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}