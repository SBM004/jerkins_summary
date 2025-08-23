import express from "express"
import mongoose from "mongoose"
import Package from "../model/Package.model.js";

// Get all packages
export const getAllPackages = async (req, res) => {
    try {
        const data = await Package.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get one package by _id
export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add comment
export async function addComment(req, res) {
    const { id } = req.params;
    const { buildType, text } = req.body;
    try {
        const pkg = await Package.findById(id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        const typeKey = buildType.replace(" Build", "");
        if (!pkg.comments[typeKey]) pkg.comments[typeKey] = [];
        const comment = {
            text,
            user: "Current User",
            timestamp: new Date()
        };
        pkg.comments[typeKey].push(comment);
        pkg.latest_comment = `${typeKey}: ${text}`;
        await pkg.save();
        res.json({ success: true, latest_comment: pkg.latest_comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Edit comment
export async function editComment(req, res) {
    const { id } = req.params;
    const { type, text, timestamp } = req.body;
    try {
        const pkg = await Package.findById(id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        const comments = pkg.comments[type] || [];
        const idx = comments.findIndex(c => new Date(c.timestamp).getTime() === new Date(timestamp).getTime());
        if (idx === -1) return res.status(404).json({ error: "Comment not found" });
        comments[idx].text = text;
        await pkg.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete comment
export async function deleteComment(req, res) {
    const { id } = req.params;
    const { type, timestamp } = req.body;
    try {
        const pkg = await Package.findById(id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        pkg.comments[type] = (pkg.comments[type] || []).filter(
            c => new Date(c.timestamp).getTime() !== new Date(timestamp).getTime()
        );
        await pkg.save();
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update image size
export async function updateImageSize(req, res) {
    const { id } = req.params;
    const { imageSize } = req.body;
    try {
        const pkg = await Package.findById(id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        pkg.imageSize = imageSize;
        await pkg.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update broken state
export async function updateBrokenState(req, res) {
    const { id } = req.params;
    const update = req.body;
    try {
        const pkg = await Package.findByIdAndUpdate(id, update, { new: true });
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}