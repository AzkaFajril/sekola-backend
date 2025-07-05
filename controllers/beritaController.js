// Berita/Artikel Controller
export const getAllBerita = async (req, res) => {
    try {
        res.status(200).json({ 
            message: "Get all berita",
            data: []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBeritaById = async (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).json({ 
            message: `Get berita with ID: ${id}`,
            data: {}
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBerita = async (req, res) => {
    try {
        res.status(201).json({ 
            message: "Berita created successfully",
            data: req.body
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBerita = async (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).json({ 
            message: `Berita with ID: ${id} updated`,
            data: req.body
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBerita = async (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).json({ 
            message: `Berita with ID: ${id} deleted`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 