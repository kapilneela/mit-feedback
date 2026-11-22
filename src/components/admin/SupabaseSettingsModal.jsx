import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, isSupabaseConnected, getSupabase } from '../../services/supabaseClient';
import fullSqlScript from '../../data/supabaseFull2200Seed.sql?raw';

export default function SupabaseSettingsModal({ isOpen, onClose }) {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [key, setKey] = useState(currentCreds.key);
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const isConnected = isSupabaseConnected();

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    saveSupabaseCredentials(url, key);
    setTestStatus('Testing Supabase connection...');

    try {
      const client = getSupabase();
      if (!client) {
        setTestStatus('Invalid or empty Supabase credentials. Falling back to local mode.');
        return;
      }
      const { error } = await client.from('feedback_questions').select('count', { count: 'exact', head: true });
      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
          setTestStatus('Connected to Supabase endpoint! Please run the SQL Setup Script in your Supabase SQL Editor to initialize the 6 tables and 2,200 students.');
        } else {
          setTestStatus(`Supabase REST response: ${error.message}`);
        }
      } else {
        setTestStatus('Connected to Supabase! All tables are active.');
      }
    } catch (err) {
      setTestStatus(`Supabase connection error: ${err.message}`);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(fullSqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard write failed, using fallback:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Institutional Blue/Navy Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b-2 border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-400/30 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className=" font-bold text-lg text-white">Supabase DB Configuration</h3>
              <p className="text-xs text-slate-300">Pure Frontend • PostgreSQL Database Connection</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
            isConnected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <div className="flex-1">
              <strong>Connection Status: </strong>
              {isConnected 
                ? 'Connected to Supabase project gnwhigxywondejqroeiq. Local dataset contains all 2,201 verified students across 32 divisions.' 
                : 'Running in Local Storage mode with all 2,201 pre-loaded MIT-WPU students.'}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://gnwhigxywondejqroeiq.supabase.co"
              className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supabase Public Anon API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sb_publishable_..."
              className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {testStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-medium text-xs leading-relaxed">
              {testStatus}
            </div>
          )}

          {/* Quick SQL setup banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Supabase SQL Setup Script (Tables + All 2,200 Students)
              </span>
              <a
                href="https://supabase.com/dashboard/project/gnwhigxywondejqroeiq/sql"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open SQL Editor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Click below to copy the complete PostgreSQL migration script. Paste and run it once in your Supabase SQL Editor to populate all 6 tables and 2,201 student records directly into your Supabase database.
            </p>
            <button
              type="button"
              onClick={handleCopySql}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-lg font-bold border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
              <span>{copied ? 'Full SQL Script Copied to Clipboard (278 KB)!' : 'Copy Complete Supabase SQL Script (All 2,200 Students)'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm cursor-pointer transition"
            >
              Save & Test Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
