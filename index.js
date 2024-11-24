import express from 'express';
import cors from 'cors';
import { getEUTradeStatistics } from './models/eu-trade-statistics.js';
import { searchAmazonSellerCentral } from './models/amazon-seller-central.js';
import { HSNandGSTdetails } from './models/hsn-gst-details.js';
import { harmonisationOfScheduleII } from './models/harmonisation-of-schedule-II.js';
import { getRoDTEPDataByHSN } from './models/RoDTEP.js';
import { getGeographicalIndicationByState } from './models/geographical-indication-tag.js';
import { generateProductDetails } from './models/extract-products.js';
import { ODOPdetails } from './models/odop-products.js';
import { generateResponse } from './generate-responses.js';
import { generateBillOfLading } from './generate-responses.js'
import { searchAmazonProductCategory } from './models/amazon-product-category.js';
import { generateProductKeywords } from './models/extract-keywords.js';
import { commodityDetails } from './models/commodity-details.js';
import { countryDetails } from './models/country-details.js';
import { dutyDrawback } from './models/duty-drawback.js';
import { generatePDF } from './models/generate-pdf.js'; 

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post('/amazon-seller-central', async (req, res) => {
    try {
      const query = req.body.query;
      if (!query) {
        res.status(400).send('Please provide a query to search');
        return;
      }
  
      const documents = await searchAmazonSellerCentral(query);
      const response = await generateResponse(query, documents);
      
      res.json(response);
    } catch (err) {
      console.error(err.stack);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.post('/amazon-product-category', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        const documents = await searchAmazonProductCategory(query);
        res.json({ documents });
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/harmonisation-of-schedule-II', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        const results = await harmonisationOfScheduleII(query);
        res.json(results);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/hsn-gst-detail', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        const results = await HSNandGSTdetails(query);
        res.json(results);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/rodtep', async (req, res) => {
    try {
        const hsnCode = req.body.hsnCode;
        if(!hsnCode) {
            res.status(400).send('Please provide a HSN code to search');
            return;
        }
        const result = await getRoDTEPDataByHSN(hsnCode);
        res.json(result);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/geographical-indication', async (req, res) => {
    try {
        const state = req.body.state;
        if(!state) {
            res.status(400).send('Please provide a state to search');
            return;
        }
        const results = await getGeographicalIndicationByState(state);
        res.json(results);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/odop-details', async (req, res) => {
    try {
        const { state, district } = req.body;
        if (!state && !district) {
            res.status(400).send('Please provide a state or district to search');
            return;
        }
        const results = await ODOPdetails(state, district);
        res.json(results);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/eu-trade-statistics', async (req, res) => {
    try {
        const hsnCode = req.body.hsnCode;
        const year = req.body.year;
        if (!hsnCode || !year) {
            res.status(400).send('Please provide both HSN code and year to search');
            return;
        }
        const data = await getEUTradeStatistics(hsnCode, year);
        res.json(data);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/generate-product-details', async (req, res) => {
    try {
        const paragraph = req.body.paragraph;
        if (!paragraph) {
            res.status(400).send('Please provide a paragraph to process');
            return;
        }
        const productDetails = await generateProductDetails(paragraph);
        res.json(productDetails);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/generate-keywords', async (req, res) => {
    try {
        const paragraph = req.body.paragraph;
        if (!paragraph) {
            res.status(400).send('Please provide a paragraph to process');
            return;
        }
        const keywords = await generateProductKeywords(paragraph);
        res.json(keywords);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/commodity-details', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        console.log('Query:', query);
        const documents = await commodityDetails(query);
        res.json(documents);

    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/country-details', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        console.log('Query:', query);
        const documents = await countryDetails(query);
        res.json(documents);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/duty-drawback', async (req, res) => {
    try {
        const query = req.body.query;
        if(!query) {
            res.status(400).send('Please provide a query to search');
            return;
        }
        console.log('Query:', query);
        const documents = await dutyDrawback(query);
        res.json(documents);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/generate-billofLading', async (req, res) => {
    try {
        const query = req.body.query; 
        if (!query) {
            res.status(400).send('Please provide a query to generate Bill of Lading');
            return;
        }
        const jsonData = await generateBillOfLading(query); 
        const base64 = await generatePDF(jsonData); 
        res.send({ base64 }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});