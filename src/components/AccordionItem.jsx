import { useState } from "react";

const AccordionItem = (result) => {
   
    const { url, errors, warnings, info, link } = result;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-300 rounded-md mb-2">
            <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <span className="font-bold text-xl">{url}</span>
                </div>
                <div className="flex space-x-4">
                    <span className="text-red-500">Errors: {errors.length}</span>
                    <span className="text-yellow-500">Warnings: {warnings.length}</span>
                    <span className="text-green-500">Info: {info.length}</span>
                    <a href={link} className="text-blue-600">w3c Link</a>
                </div>
            </div>
            {isOpen && (
                <div className="p-4 bg-gray-50">
                    {errors.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-md shadow-inner mb-12">
                            <h4 className="font-semibold text-md text-red-600 mb-2">Errors</h4>
                            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                                {errors.map((item, index) => (
                                    <div key={index} className="flex border-b">
                                        <div className="w-1/4">
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Position
                                            </div>
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Message
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="p-2 text-sm">
                                                {item.extract}
                                            </div>
                                            <div className="p-2 text-sm font-medium">
                                                {item.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {warnings.length > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-md shadow-inner mb-12">
                            <h4 className="font-semibold text-md text-yellow-600 mb-2">Warnings</h4>
                            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                                {warnings.map((item, index) => (
                                    <div key={index} className="flex border-b">
                                        <div className="w-1/4">
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Position
                                            </div>
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Message
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="p-2 text-sm">
                                                {item.extract}
                                            </div>
                                            <div className="p-2 text-sm font-medium">
                                                {item.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {info.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-md shadow-inner mb-12">
                            <h4 className="font-semibold text-md text-green-600 mb-2">Info</h4>
                            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                                {info.map((item, index) => (
                                    <div key={index} className="flex border-b">
                                        <div className="w-1/4">
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Position
                                            </div>
                                            <div className="p-2 border-r text-sm font-medium text-gray-600">
                                                Message
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="p-2 text-sm">
                                                {item.extract}
                                            </div>
                                            <div className="p-2 text-sm font-medium">
                                                {item.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
