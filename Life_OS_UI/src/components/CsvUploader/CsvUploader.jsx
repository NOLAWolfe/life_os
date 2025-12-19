import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useFinancials } from '../../contexts/FinancialContext';
import './CsvUploader.css';

const SingleDropzone = ({ onFileUpload, title }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const headers = {};
            try {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => {
                        const cleanHeader = header.trim();
                        if (headers[cleanHeader]) {
                            headers[cleanHeader]++;
                            return `${cleanHeader}_${headers[cleanHeader]}`;
                        }
                        headers[cleanHeader] = 1;
                        return cleanHeader;
                    },
                    complete: (results) => {
                        onFileUpload(results.data);
                    },
                    error: (error) => {
                        console.error(`Error parsing ${title} CSV:`, error);
                        alert(`Error parsing ${title} CSV file.`);
                    }
                });
            } catch (error) {
                console.error(`Error processing ${title} file:`, error);
                alert(`Error processing ${title} CSV file. Check console for details.`);
            }
        }
    }, [onFileUpload, title]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
    });

    return (
        <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the {title} file here ...</p>
            ) : (
                <p>Drag 'n' drop {title} CSV, or click to select</p>
            )}
        </div>
    );
};


const CsvUploader = () => {
    const { 
        handleTransactionsUpload, 
        handleCategoriesUpload, 
        handleDebtUpload,
        handleAccountsUpload,
        handleBalancesUpload 
    } = useFinancials();

    return (
        <div className="csv-uploader-container">
            <h3>Upload Tiller CSVs</h3>
            <div className="dropzone-grid">
                <SingleDropzone onFileUpload={handleTransactionsUpload} title="Transactions" />
                <SingleDropzone onFileUpload={handleAccountsUpload} title="Accounts" />
                <SingleDropzone onFileUpload={handleBalancesUpload} title="Balances" />
                <SingleDropzone onFileUpload={handleCategoriesUpload} title="Categories" />
                <SingleDropzone onFileUpload={handleDebtUpload} title="Debt Payoff" />
            </div>
        </div>
    );
};

export default CsvUploader;
