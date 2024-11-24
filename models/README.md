# Cross-Border Regulatory Oversight and Strategic Solutions Intelligence (Cross Intelligence)

## Theme Details

### Theme Name
Create a GenAI-Powered Tool to Simplify Cross-Border Regulations and Govt. Incentives for Sellers in E-commerce

### Theme Benefits
- Simplified Cross-Border Compliance
- Multilingual Support and Multimodal Capabilities
- Automated Document Generation
- Real-Time Updates on Regulatory Changes
- Access to Global Incentives and Subsidies
- Enhanced Market Intelligence
- Cost and Time Efficiency
- Reduced Risk of Compliance Penalties
- Improved Customer Confidence and Market Access

## Idea and Approach Details

### Solution Overview
The proposed solution is a Generative AI-powered compliance and guidance tool designed to facilitate the international expansion of companies aiming to enter new markets with complex regulatory requirements. This tool provides a comprehensive overview of regulatory compliance, cross-border trade documentation, and export incentives for markets such as the United States and Europe. By aggregating data from government and third-party sources, the solution supports companies in navigating market-specific regulations, identifying applicable incentives, and mitigating risks associated with international expansion.

### Key Features
- Automated Document Generation
- Compliance Tracking
- Multilingual Support
- Dynamic Updates

## Technology Stack

### Frontend
- React.js

### Backend
- Node.js with Express.js

### Generative AI and Machine Learning
- Llama 3 (Llama3-70b-instruct) for natural language processing
- nomic-embed-text-v1
- RAG Model

### Data Aggregation
- Integrating data from platforms such as Amazon Seller Central, DGFT, and MACMAP to retrieve compliance requirements, incentive information, and industry-specific guidance.

### Knowledge Base
- MongoDB with Atlas search for scalable data storage and retrieval
- Redis caching for optimized query performance

### Cloud Infrastructure
- AWS

### Bhashini
- Operates under the Gov. of India's NLTM
- Multilingual / Multimodal
- [Bhashini.gov.in](https://bhashini.gov.in)

## Project Structure

```
index.js
models/
    amazon-product-category.js
    amazon-seller-central.js
    commodity-details.js
    country-details.js
    duty-drawback.js
    eu-trade-statistics.js
    extract-keywords.js
    extract-products.js
    generate-pdf.js
    generate-responses.js
    geographical-indication-tag.js
    get-embeddings.js
    harmonisation-of-schedule-II.js
    hsn-gst-details.js
    ingest-data.js
    odop-products.js
    rag-vector-index.js
    README.md
    RoDTEP.js
package.json
RoDTEP.json
```

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd cross-intelligence
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. Access the application at `http://localhost:4000`

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.