---
title: Tao Translate
date: 2023-7-1
description:  Showing similarities for ~200 translations of the daodejing.
tag: code
---

A full stack app showing similarities for ~200 translations of the daodejing

# Background

The Daodejing has been called the most translated text besides the Bible, and currently has over 250 translations in Western languages. Its text is an "anthology of earlier sayings and teachings", from the oral tradition of “Laoist” schools around 300 B.C., as well as additions made by teachers who “composed” and arranged the sayings into chapters. The standard traditional Chinese text of the Daodejing is translated from the Wang Pi commentary, although some more recent translations are based on the Ma-wang-tui manuscripts.

The proliferation of the Daodejing has had profound influences in both the east and west. In ancient China, it represented an opposition to the presiding Confucian cultural system. Over the centuries, Daoist commentaries and cults emerged with roots tracing back to the original text. In the West, the Daodejing is popular both among academics as a rich historical document and to the layperson for its lessons. For our purposes, we consider the Daodejing because of the multitude of unique translations into English.

The more popular of its translations are not without criticism. In his essay "Those Who Don’t Know Speak: Translations of *Laozi* by People Who Do Not Know Chinese," Paul Goldin criticizes four translations of the Daodejing by Americans who do not speak Chinese, but rather rephrased and English version into their own verse. It may seem overly harsh to criticize translations that were marketed to be popular among non-scholars, but Goldin makes the valid point that such translations cheapen the standard of a classic and difficult text by appropriating the palatable parts, while ignoring the rest. In this sense, it sets a double standard for Western classics whose meanings are generally preserved in translation. The translations referred to, by Witter Bynner, Stephan Mitchell, Thomas Miles, and Ursula Le Guin, are addressed in the results section below.


Built with next.js, on [pgvector starter](https://vercel.com/templates/next.js/postgres-pgvector)

![screen shot of podcast](/images/ddj-screen.png)

Approach:
- parse and tokenize the first chapter of the tao te ching (one source: [here](https://www.bopsecrets.org/gateway/passages/tao-te-ching.htm))
- generate embeddings for each chapter
- display using pgvector cosine similarities

View here -> [Tao Translations on Vercel](https://ddj-detc.vercel.app/)

