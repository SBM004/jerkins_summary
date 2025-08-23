import express from 'express';
import {
    addComment,
    getAllPackages,
    getPackageById,
    editComment,
    deleteComment,
    updateImageSize,
    updateBrokenState
} from '../controllers/package.controller.js';

const router = express.Router();

router.get('/packages', getAllPackages); // Get all packages
router.get('/packages/:id', getPackageById); // Get one package by _id
router.post('/packages/:id/comments', addComment); // Add comment
router.put('/packages/:id/comments/edit', editComment); // Edit comment
router.delete('/packages/:id/comments/delete', deleteComment); // Delete comment
router.put('/packages/:id/image-size', updateImageSize); // Update image size
router.put('/packages/:id/broken-state', updateBrokenState); // Update broken state

export default router;