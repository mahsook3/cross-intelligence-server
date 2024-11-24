import pdf from 'pdf-creator-node';
import Handlebars from 'handlebars';

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill of Lading</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 20px;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            gap: 10px;
        }
        .grid-2 {
            grid-template-columns: 1fr 1fr;
        }
        .grid-3 {
            grid-template-columns: 1fr 1fr 1fr;
        }
        .box {
            border: 1px solid #000;
            padding: 5px;
        }
        .box h2 {
            font-size: 12px;
            margin: 0 0 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
        }
        .footer {
            font-size: 8px;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{documentTitle}}</h1>
        
        <div class="grid grid-2">
            <div class="box">
                <h2>Shipper</h2>
                <p>{{shipper.name}}<br>
                {{shipper.address}}<br>
                {{shipper.cityStateZip}}</p>
            </div>
            <div class="grid">
                <div class="grid grid-2">
                    <div class="box">
                        <strong>B/L No.:</strong> {{details.blNumber}}
                    </div>
                </div>
                <div class="box">
                    <strong>Shipper's Reference:</strong> {{details.shipperReference}}
                </div>
                <div class="box">
                    <strong>Carrier's Reference:</strong> {{details.carrierReference}}
                </div>
                <div class="box">
                    <strong>Unique Consignment Ref.:</strong> {{details.uniqueConsignmentRef}}
                </div>
                <div class="box">
                    <strong>Carrier Name:</strong> {{details.carrierName}}
                </div>
            </div>
        </div>

        <div class="grid grid-2" style="margin-top: 10px;">
            <div class="box">
                <h2>Consignee</h2>
                <p>{{consignee.name}}<br>
                {{consignee.address}}<br>
                {{consignee.cityStateZip}}</p>
            </div>
            <div class="box">
                <h2>Notify Party (If not Consignee)</h2>
                <p>{{notifyParty.name}}<br>
                {{notifyParty.address}}<br>
                {{notifyParty.cityStateZip}}</p>
            </div>
        </div>

        <div class="grid grid-3" style="margin-top: 10px;">
            <div class="box">
                <strong>Pre-Carriage By:</strong> {{details.preCarriageBy}}
            </div>
            <div class="box">
                <strong>Place of Receipt:</strong> {{details.placeOfReceipt}}
            </div>
            <div class="box">
                <strong>Additional Information:</strong> {{details.additionalInformation}}
            </div>
        </div>

        <div class="grid grid-3" style="margin-top: 10px;">
            <div class="box">
                <strong>Vessel / Aircraft:</strong> {{details.vesselAircraft}}
            </div>
            <div class="box">
                <strong>Voyage No.:</strong> {{details.voyageNumber}}
            </div>
            <div class="box">
                <strong>Port of Loading:</strong> {{details.portOfLoading}}
            </div>
        </div>

        <div class="grid grid-3" style="margin-top: 10px;">
            <div class="box">
                <strong>Port of Discharge:</strong> {{details.portOfDischarge}}
            </div>
            <div class="box">
                <strong>Place of Delivery:</strong> {{details.placeOfDelivery}}
            </div>
            <div class="box">
                <strong>Final Destination:</strong> {{details.finalDestination}}
            </div>
        </div>

        <table style="margin-top: 10px;">
            <thead>
                <tr>
                    <th>Marks & Numbers</th>
                    <th>Kind & No of Packages</th>
                    <th>Description of Goods</th>
                    <th>Net Weight (Kg)</th>
                    <th>Gross Weight (Kg)</th>
                    <th>Measurements (m³)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{cargo.0.marksAndNumbers}}</td>
                    <td>{{cargo.0.kindAndNoOfPackages}}</td>
                    <td>{{cargo.0.descriptionOfGoods}}</td>
                    <td>{{cargo.0.netWeightKg}}</td>
                    <td>{{cargo.0.grossWeightKg}}</td>
                    <td>{{cargo.0.measurementsM3}}</td>
                </tr>
                <tr>
                    <td colspan="6">
                        <strong>Total This Page:</strong> {{totals.totalPackages}}, {{totals.totalGrossWeightKg}} Kg, {{totals.totalVolumeM3}} m³
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="grid grid-3">
            <div class="box">
                <strong>Container No(s):</strong> {{containerDetails.containerNumbers}}
            </div>
            <div class="box">
                <strong>Seal No(s):</strong> {{containerDetails.sealNumbers}}
            </div>
            <div class="box">
                <strong>Size / Type:</strong> {{containerDetails.sizeType}}
            </div>
        </div>

        <div class="grid grid-2" style="margin-top: 10px;">
            <div class="box">
                <h2>Terms and Conditions</h2>
                <p style="font-size: 8px;">
                    {{termsAndConditions}}
                </p>
            </div>
            <div class="box">
                <p><strong>Place and Date of Issue:</strong> {{issueDetails.placeAndDateOfIssue}}</p>
                <p><strong>Signatory Company:</strong> {{issueDetails.signatoryCompany}}</p>
                <p><strong>Name of Authorized Signatory:</strong> {{issueDetails.authorizedSignatoryName}}</p>
                <p><strong>Signature:</strong> ____________________</p>
            </div>
        </div>

        <div class="footer">
            <p>{{footer}}</p>
        </div>
    </div>
</body>
</html>`;

export async function generatePDF(jsonData) {
    const template = Handlebars.compile(htmlTemplate);
    const html = template(jsonData);

    const document = {
        html: html,
        data: jsonData,
        type: 'buffer',
    };

    try {
        const buffer = await pdf.create(document);
        const base64 = buffer.toString('base64');
        return base64;
    } catch (error) {
        console.error(error);
        throw new Error('Error generating PDF');
    }
}