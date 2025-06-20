import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoXCircleFill } from "react-icons/go";
import tahapan from '../tahapan.jpg';

const Tahapan = () => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const openViewer = useCallback((url) => {
        setImageUrl(url);
        setIsViewerOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeViewer = useCallback(() => {
        setIsViewerOpen(false);
        setImageUrl('');
        document.body.style.overflow = 'unset';
    }, []);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="tahapan-section bg-light2 py-5" id="tahapan">
            <div className="container">
                <h2 className="text-center text-blue fw-bold my-4">Tahapan</h2>
                <motion.img
                    whileHover={{ scale: 1.05, cursor: 'pointer' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    src={tahapan}
                    alt="Tahapan Terapi"
                    className="img-fluid mx-auto d-block rounded"
                    style={{maxHeight: '300px'}}
                    onClick={() => openViewer(tahapan)}
                />

                {/* Modal Viewer */}
                <AnimatePresence>
                    {isViewerOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="modal-backdrop-custom"
                            onClick={closeViewer}
                        >
                            <motion.img
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                src={imageUrl}
                                alt="Gambar Fullscreen"
                                className="img-fullscreen"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                onClick={closeViewer}
                                className="btn-close-custom"
                            >
                                <GoXCircleFill className="fs-3 text-white" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tahapan;
