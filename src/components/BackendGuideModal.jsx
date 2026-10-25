import React, { useState } from 'react';
import { X, Database, Code, CheckCircle, Copy, ArrowRight, Layers } from 'lucide-react';

export const BackendGuideModal = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchema = `-- SmartLedger MySQL Database Schema
CREATE DATABASE IF NOT EXISTS smartledger_db;
USE smartledger_db;

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'income' or 'expense'
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category_budgets (
    category_id VARCHAR(100) PRIMARY KEY,
    budget_limit DECIMAL(12, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

  const javaEntity = `package com.smartledger.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    private String type; // "income" or "expense"

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Default Constructor, Getters, and Setters
    public Transaction() {}
    // ...
}`;

  const javaController = `package com.smartledger.controller;

import com.smartledger.model.Transaction;
import com.smartledger.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "http://localhost:3000") // Connect with Vite frontend
public class TransactionController {

    private final TransactionRepository repository;

    public TransactionController(TransactionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Transaction> getAll() {
        return repository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return repository.save(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable Long id, @RequestBody Transaction details) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(details.getTitle());
            existing.setAmount(details.getAmount());
            existing.setType(details.getType());
            existing.setCategory(details.getCategory());
            existing.setDate(details.getDate());
            existing.setPaymentMethod(details.getPaymentMethod());
            existing.setNotes(details.getNotes());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <Database size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Spring Boot + MySQL Integration Blueprint</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                How this frontend is pre-architected to connect with your future Java backend
              </p>
            </div>
          </div>
          <button className="btn-icon-subtle" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Architecture Flow */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ padding: '0.5rem 0.75rem', background: '#eef2ff', borderRadius: '6px', fontWeight: 600, fontSize: '0.825rem', color: '#3730a3' }}>
                React 18 + Vite (Port 3000)
              </div>
              <ArrowRight size={16} color="#94a3b8" />
              <div style={{ padding: '0.5rem 0.75rem', background: '#ecfdf5', borderRadius: '6px', fontWeight: 600, fontSize: '0.825rem', color: '#065f46' }}>
                apiService.js (REST Fetch)
              </div>
              <ArrowRight size={16} color="#94a3b8" />
              <div style={{ padding: '0.5rem 0.75rem', background: '#fffbeb', borderRadius: '6px', fontWeight: 600, fontSize: '0.825rem', color: '#92400e' }}>
                Spring Boot API (Port 8080)
              </div>
              <ArrowRight size={16} color="#94a3b8" />
              <div style={{ padding: '0.5rem 0.75rem', background: '#fef2f2', borderRadius: '6px', fontWeight: 600, fontSize: '0.825rem', color: '#991b1b' }}>
                MySQL Database
              </div>
            </div>
          </div>

          {/* Step Instructions */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Ready Frontend Service Location:
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Check <code style={{ background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>src/services/apiService.js</code>. It already contains all CRUD operations mapped to <code style={{ background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>/api/v1/transactions</code> and <code style={{ background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>/api/v1/budgets</code>.
            </p>
          </div>

          {/* SQL Snippet */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', color: '#f8fafc', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>1. MySQL Database Schema (schema.sql)</span>
              <button 
                onClick={() => handleCopy(sqlSchema, 'sql')}
                style={{ color: '#94a3b8', fontSize: '0.75rem' }}
              >
                {copiedSection === 'sql' ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedSection === 'sql' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, padding: '0.85rem', backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '0.75rem', overflowX: 'auto' }}>
              {sqlSchema}
            </pre>
          </div>

          {/* Java Spring Controller Snippet */}
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', color: '#f8fafc', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>2. Spring Boot Controller (TransactionController.java)</span>
              <button 
                onClick={() => handleCopy(javaController, 'controller')}
                style={{ color: '#94a3b8', fontSize: '0.75rem' }}
              >
                {copiedSection === 'controller' ? <CheckCircle size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedSection === 'controller' ? 'Copied' : 'Copy Java'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, padding: '0.85rem', backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '0.75rem', overflowX: 'auto' }}>
              {javaController}
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
