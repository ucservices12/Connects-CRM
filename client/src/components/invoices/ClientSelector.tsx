import React, { useState } from 'react';
import { Search } from 'lucide-react';

type Client = {
    id: string;
    companyName: string;
    name: string;
    address: string;
    email: string;
};

interface ClientSelectorProps {
    selectedClient: string;
    onChange: (clientId: string) => void;
    clients: Client[];
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
    selectedClient,
    onChange,
    clients,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedClientData = clients.find(client => client.id === selectedClient);

    const handleSelect = (clientId: string) => {
        onChange(clientId);
        setIsOpen(false);
        console.log("invoiceSelectedClient=>", selectedClient);
    };

    return (
        <div className="relative">
            <div
                className="form-input flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedClientData ? (
                    <div>
                        <div className="font-medium">{selectedClientData.companyName}</div>
                        <div className="text-sm text-neutral-500">{selectedClientData.name}</div>
                    </div>
                ) : (
                    <span className="text-neutral-500">Select a client</span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-10">
                    <div className="p-2 border-b border-neutral-200">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                            <input
                                type="text"
                                className="form-input pl-9"
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client, index) => (
                                <div
                                    key={index}
                                    className={`p-3 hover:bg-neutral-50 cursor-pointer ${selectedClient === client.id ? 'bg-primary-50' : ''}`}
                                    onClick={() => handleSelect(client.id)}
                                >
                                    <div className="font-medium">{client.companyName}</div>
                                    <div className="text-sm text-neutral-500 flex justify-between">
                                        <span>{client.name}</span>
                                        <span>{client.email}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-neutral-500">
                                No clients found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSelector;