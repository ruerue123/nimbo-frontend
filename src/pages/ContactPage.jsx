import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import api from '../api/api';
import toast from 'react-hot-toast';

const contactInfo = [
    { Icon: MdEmail, label: 'Email', value: 'info@nimbo.co.zw', color: 'text-red-500', bg: 'bg-red-50' },
    { Icon: MdPhone, label: 'Phone', value: '+263 776 573 701', color: 'text-green-500', bg: 'bg-green-50' },
    { Icon: MdLocationOn, label: 'Location', value: 'Harare, Zimbabwe', color: 'text-cyan-500', bg: 'bg-cyan-50' },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/home/contact', form);
            toast.success(data?.message || 'Message sent!');
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Could not send your message. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <Header />
            <div className="w-[85%] mx-auto py-12 md:py-8">

                {/* Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
                    <p className="text-gray-500 text-lg">Have questions? We’re here to help.</p>
                </div>

                {/* NB: this project's Tailwind screens are max-width (desktop-first),
                    so base = desktop (2 cols), md: overrides for small screens (1 col). */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-8 items-start">

                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        {contactInfo.map(({ Icon, label, value, color, bg }) => (
                            <div
                                key={label}
                                className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`${color} text-2xl`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-medium">{label}</p>
                                    <p className="text-gray-800 font-semibold">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={onSubmit} className="bg-white shadow-xl p-8 rounded-2xl border border-gray-100 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={onChange}
                                required
                                placeholder="How can we help?"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all h-32 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-60"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
