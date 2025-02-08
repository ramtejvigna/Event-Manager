import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const CreateEvent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        capacity: '',
        image: null,
    });

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', "event_manager_cloud");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dwo9xy0ot/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );


        const data = await response.json();
        console.log(data.url, data.secure_url);
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = '';
            if (formData.image) {
                imageUrl = await handleImageUpload(formData.image);
            }

            console.log('Token before request : ', localStorage.getItem('token') );
            const eventDateTime = `${formData.date}T${formData.time}`;
            const response = await api.post('/api/events', {
                ...formData,
                date: eventDateTime,
                imageUrl,
            });

            navigate(`/dashboard`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const Select = ({ label, options, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <select
                {...props}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
            >
                <option value="">Select a category</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const steps = [
        {
            title: "Basic Details",
            fields: (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            Title
                        </label>
                        <input
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter event title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your event"
                            className="w-full h-60 resize-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Date & Location",
            fields: (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label>
                        <input
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter event location"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Additional Details",
            fields: (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        options={[
                            { value: 'conference', label: 'Conference' },
                            { value: 'workshop', label: 'Workshop' },
                            { value: 'social', label: 'Social' },
                            { value: 'other', label: 'Other' }
                        ]}
                    />
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Capacity
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            min="1"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            placeholder="Enter event capacity"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Event Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                            <div className="space-y-1 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        Create New Event
                    </h2>

                    <div className="flex justify-center space-x-2 mb-8">
                        {steps.map((_, index) => (
                            <div key={index} className="flex-1 max-w-[100px]">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${currentStep >= index + 1 ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="min-h-[400px]">
                            {steps[currentStep - 1].fields}
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(curr => curr - 1)}
                                disabled={currentStep === 1}
                                className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-all duration-200 
                                    ${currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:-translate-x-1 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            {currentStep < steps.length ? (
                                <button
                                    type="button" // Explicitly set type to "button"
                                    onClick={() => setCurrentStep(curr => curr + 1)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 hover:translate-x-1"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Event'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;