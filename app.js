import express from 'express'
import axios from 'axios';
import {getRawAndCorrectedTexts,getRawText, createRaw, getNoneCorrectedRaw, getStudentTeacherConnections, createRawCorrection,} from './database.js'
import { v2 } from '@google-cloud/translate';
import dotenv from 'dotenv'


const { Translate } = v2;
const app = express()
dotenv.config();
// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const API_KEY = '';
const apiUrl = '';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

  const data = {
    model: "gpt-4o",  // Specify the model you want to use
    messages: [
    //   { role: "system", content: "You are a helpful assistant." },
      { role: "system", content: "You are helpful assistant" },
      { role: "user", content: "Ninde wahagaritse amacakubiri mu Rwanda" }
    ],
  };


 




app.get("/allTexts",async(req,res)=>{
    const texts = await getRawAndCorrectedTexts();
    res.send(texts);
});

app.get("/rawText/:id",async(req,res)=>{
    const id = req.params.id;
    const text = await getRawText(id);
    res.send(text);
});
app.get("/gptRawText",async(req,res)=>{
    axios.post(apiUrl, data, { headers })
    .then(response => {
      // res.send(response.data.choices[0].message.content);
    //     translateText(response.data.choices[0].message.content, 'rw')
    // .then((res1) => {
    //     // res.send(res1);
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
      res.send( response.data.choices[0].message.content);
    })
    .catch(error => {
      console.error('Error making request to ChatGPT:', error);
    });
    
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });


app.listen(8080,()=>{
    console.log("the server is running on port 8080");
});