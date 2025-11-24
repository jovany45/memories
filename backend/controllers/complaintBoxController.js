import ComplaintBox from '../models/ComplaintBox.js';

// Messages sarcastiques pour les plaintes
const sarcasticMessages = {
  created: [
    "Plainte enregistrée ! La direction du centre 2ISA va peut-être la lire... un jour. 📝",
    "Ta plainte rejoint les 847 autres dans le dossier 'améliorations à venir'. Bon courage ! 🗂️",
    "Merci pour ta contribution au cahier de doléances du centre ! 📖",
    "Plainte reçue ! L'administration hautement qualifiée prend note... ou pas. ✅",
    "Félicitations ! Ta voix a été entendue (enfin, enregistrée au moins). 🎉"
  ],
  voted: [
    "Vote enregistré ! Comme si ça changeait quelque chose... 🗳️",
    "Merci pour ton vote démocratique dans notre simulation de démocratie ! 🏛️",
    "Un vote de plus dans l'océan de l'indifférence administrative. 🌊",
    "Tu as voté ! La direction prend note (enfin, peut-être). 📝",
    "Vote comptabilisé ! On atteint presque les niveaux de participation de l'Eurovision. 🎵"
  ],
  commented: [
    "Commentaire ajouté ! Les débats s'enflamment... ou pas. 💬",
    "Merci pour ton commentaire constructif (ou pas, on s'en fout). 🗨️",
    "Tu viens de contribuer au grand débat démocratique du centre ! 🎭",
    "Commentaire posté ! Le niveau de conversation vient de monter (ou descendre). 📊",
    "Ton commentaire rejoint la cacophonie générale. Bravo ! 🎺"
  ],
  noComplaints: [
    "Pas de plaintes ? C'est louche... Le centre 2ISA serait-il parfait ? 🤐",
    "Aucune plainte pour l'instant. Le calme avant la tempête ? ⛈️",
    "Zéro plainte ! Soit tout va parfaitement au centre, soit personne n'ose parler. 🤷",
    "Pas de complaintes... La vie au centre 2ISA serait-elle idyllique ? 🏢",
    "Aucune plainte enregistrée sur la vie au centre. L'omerta est respectée ! 🤫"
  ]
};

// Obtenir un message sarcastique aléatoire
const getRandomMessage = (type) => {
  const messages = sarcasticMessages[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Créer une plainte (anonyme)
export const createComplaint = async (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le contenu de la plainte est requis' 
      });
    }

    const complaint = new ComplaintBox({
      content,
      category: category || 'autre'
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: getRandomMessage('created'),
      complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de la plainte' 
    });
  }
};

// Obtenir toutes les plaintes
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await ComplaintBox.find()
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 });

    if (complaints.length === 0) {
      return res.json({
        success: true,
        message: getRandomMessage('noComplaints'),
        complaints: []
      });
    }

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des plaintes' 
    });
  }
};

// Obtenir une plainte par ID
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await ComplaintBox.findById(req.params.id)
      .populate('comments.author', 'username avatar');

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plainte introuvable' 
      });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération de la plainte' 
    });
  }
};

// Voter pour une plainte (upvote/downvote)
export const voteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' ou 'downvote'
    const userId = req.user._id;

    const complaint = await ComplaintBox.findById(id);

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plainte introuvable' 
      });
    }

    // Retirer les votes précédents
    complaint.upvotes = complaint.upvotes.filter(vote => vote.toString() !== userId.toString());
    complaint.downvotes = complaint.downvotes.filter(vote => vote.toString() !== userId.toString());

    // Ajouter le nouveau vote
    if (voteType === 'upvote') {
      complaint.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      complaint.downvotes.push(userId);
    }

    await complaint.save();

    res.json({
      success: true,
      message: getRandomMessage('voted'),
      complaint
    });
  } catch (error) {
    console.error('Error voting complaint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du vote' 
    });
  }
};

// Ajouter un commentaire à une plainte
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le contenu du commentaire est requis' 
      });
    }

    const complaint = await ComplaintBox.findById(id);

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plainte introuvable' 
      });
    }

    complaint.comments.push({
      author: userId,
      content
    });

    await complaint.save();
    await complaint.populate('comments.author', 'username avatar');

    res.json({
      success: true,
      message: getRandomMessage('commented'),
      complaint
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'ajout du commentaire' 
    });
  }
};

// Supprimer une plainte (admin uniquement)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await ComplaintBox.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plainte introuvable' 
      });
    }

    res.json({
      success: true,
      message: 'Plainte supprimée avec succès (censure activée ! 🔇)'
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression de la plainte' 
    });
  }
};

// Mettre à jour le statut d'une plainte (admin uniquement)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const complaint = await ComplaintBox.findByIdAndUpdate(
      id,
      { status, adminComment },
      { new: true }
    ).populate('comments.author', 'username avatar');

    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plainte introuvable' 
      });
    }

    const statusMessages = {
      acknowledged: 'Plainte prise en compte ! (On fait semblant de s\'en soucier) 📋',
      in_progress: 'Traitement en cours... Patience, ça prend du temps ! ⏳',
      resolved: 'Problème résolu ! (Ou on l\'a juste marqué comme tel) ✅',
      rejected: 'Plainte rejetée ! Dommage pour toi... ❌',
      ignored: 'Plainte ignorée officiellement. Au moins c\'est clair ! 🙈'
    };

    res.json({
      success: true,
      message: statusMessages[status] || 'Statut mis à jour !',
      complaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du statut' 
    });
  }
};

// Obtenir les statistiques des plaintes (admin)
export const getComplaintStats = async (req, res) => {
  try {
    const totalComplaints = await ComplaintBox.countDocuments();
    const complaintsByStatus = await ComplaintBox.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const complaintsByCategory = await ComplaintBox.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalComplaints,
        byStatus: complaintsByStatus,
        byCategory: complaintsByCategory
      }
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
};
