import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY1,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const sampleJSON = `{
  "Mandatory Requirements": [
    {
      "Requirement": "Requirement 1",
      "Description": "Description 1"
    },
    {
      "Requirement": "Requirement 2",
      "Description": "Description 2"
    },
    {
      "Requirement": "Requirement 3",
      "Description": "Description 3"
    },
    {
      "Requirement": "Requirement 4",
      "Description": "Description 4"
    },
    {
      "Requirement": "Requirement 5",
      "Description": "Description 5"
    }
  ],
  "Recommended Requirements": [
    {
      "Requirement": "Requirement 6",
      "Description": "Description 6"
    },
    {
      "Requirement": "Requirement 7",
      "Description": "Description 7"
    },
    {
      "Requirement": "Requirement 8",
      "Description": "Description 8"
    }
  ],
  "Reference URLs": [
    "URL 1",
    "URL 2",
    "URL 3"
  ]
}`;

const BillOfLading = `{
  "documentTitle": "Bill of Lading",
  "shipper": {
    "name": "Shipper Name",
    "address": "123 Shipper Street",
    "cityStateZip": "Shipper City, State 12345"
  },
  "consignee": {
    "name": "Consignee Name",
    "address": "456 Consignee Avenue",
    "cityStateZip": "Consignee City, State 67890"
  },
  "notifyParty": {
    "name": "Notify Party Name",
    "address": "789 Notify Street",
    "cityStateZip": "Notify City, State 13579"
  },
  "details": {
    "blNumber": "BL123456789",
    "shipperReference": "SHIP-REF-001",
    "carrierReference": "CARR-REF-001",
    "uniqueConsignmentRef": "UCR-001",
    "carrierName": "Global Shipping Co.",
    "preCarriageBy": "Truck",
    "placeOfReceipt": "Port A",
    "additionalInformation": "",
    "vesselAircraft": "SS CARGO EXPRESS",
    "voyageNumber": "V001",
    "portOfLoading": "Port B",
    "portOfDischarge": "Port C",
    "placeOfDelivery": "Warehouse X",
    "finalDestination": "City Y"
  },
  "cargo": [
    {
      "marksAndNumbers": "ABCD1234",
      "kindAndNoOfPackages": "10 Pallets",
      "descriptionOfGoods": "Electronic Components",
      "netWeightKg": 5000,
      "grossWeightKg": 5500,
      "measurementsM3": 20
    }
  ],
  "totals": {
    "totalPackages": "10 Pallets",
    "totalGrossWeightKg": 5500,
    "totalVolumeM3": 20
  },
  "containerDetails": {
    "containerNumbers": ["CONT123", "CONT456"],
    "sealNumbers": ["SEAL789", "SEAL012"],
    "sizeType": "40' High Cube"
  },
  "termsAndConditions": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc. Sed euismod, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc.",
  "issueDetails": {
    "placeAndDateOfIssue": "Port A, 2023-06-15",
    "signatoryCompany": "Global Shipping Co.",
    "authorizedSignatoryName": "John Doe",
    "signature": ""
  },
  "footer": "Shipped on board the vessel, in apparent good order and condition for carriage to the port of discharge or so near thereunto as she may safely get, and to be delivered in the like good order and condition as above."
}
`;

const prompt = `You are Smart International Business Advisors. Provide only the mandatory and recommended compliance requirements in JSON format, following this structure exactly. Do not include any explanatory text or additional information outside of JSON. Format: ${sampleJSON}. Here is the data:`;

export async function generateResponse(query, documents) {
  if (!Array.isArray(documents)) {
    console.error('Expected documents to be an array');
    return 'Error: documents is not an array';
  }

  let textDocuments = "";
  documents.forEach(doc => {
    textDocuments += doc.document.pageContent;
  });

  const completion = await openai.chat.completions.create({
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    messages: [{ "role": "user", "content": `${prompt} Add only related to my product ${query}. ${sampleJSON} Here is the data: ${textDocuments}` }],
    temperature: 0.5,
    top_p: 1,
    max_tokens: 1024,
    stream: true,
  });

  let response = '';
  for await (const chunk of completion) {
    response += chunk.choices[0]?.delta?.content || '';
  }

  console.log("Generated text:", response);

  const jsonMatch = response.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);

  let details;
  if (jsonMatch) {
    try {
      details = JSON.parse(jsonMatch[0]);
      return details;  
    } catch (error) {
      console.error("Error parsing JSON:", error, "Extracted JSON text:", jsonMatch[0]);
      return { error: 'Failed to parse response as JSON' };
    }
  } else {
    console.error("No JSON found in response:", response);
    return { error: 'No JSON found in response' };
  }
}

export async function generateBillOfLading(query) {

  const completion = await openai.chat.completions.create({
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    messages: [{ "role": "user", "content": `Create a Bill of Lading with given data Add only related to my product details and provided details ${query}.Please return **only** a valid JSON object without any extra text, comments, or formatting like code blocks. The result should be in the following JSON structure: ${BillOfLading}` }],
    temperature: 0.5,
    top_p: 1,
    max_tokens: 1024,
    stream: true,
  });

  let response = '';
  for await (const chunk of completion) {
    response += chunk.choices[0]?.delta?.content || '';
  }

  console.log("Generated text:", response);

  const jsonMatch = response.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);

  let details;
  if (jsonMatch) {
    try {
      details = JSON.parse(jsonMatch[0]); 
      return details;
    } catch (error) {
      console.error("Error parsing JSON:", error, "Extracted JSON text:", jsonMatch[0]);
      return { error: 'Failed to parse response as JSON' };
    }
  } else {
    console.error("No JSON found in response:", response);
    return { error: 'No JSON found in response' };
  }
}