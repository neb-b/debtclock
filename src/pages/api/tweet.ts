import { NextApiResponse, NextApiRequest } from "next"
import { getData } from "core/data"
import captureWebsite from "capture-website"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { auth },
  } = req

  // if (process.env.NODE_ENV === "production" && auth !== process.env.PING_AUTH) {
  //   res.status(401).json({ error: "unauthorized" })
  //   return
  // }

  try {
    const { usd } = await getData()

    // send tweet
    await captureWebsite.file("https://usdebt.wtf?screenshot", "./screenshot.png", {
      scaleFactor: 2,
      width: 400,
      height: 400,
    })

    res.status(200).json({ total_debt: usd.initialAmount })
  } catch (error) {
    console.log(error)
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
