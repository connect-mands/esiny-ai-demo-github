const MRI_KEYWORDS = [
    "mri",
    "impression",
    "findings",
    "clinical history",
    "technique",
    "lumbar",
    "cervical",
    "thoracic",
    "brain",
    "spine",
    "disc",
    "vertebral",
    "stenosis",
    "canal",
    "foramen",
    "nerve",
    "contrast",
    "radiology",
  ];
  
  export const validateMRIReport = (text: string) => {
    if (!text || text.trim().length < 80) {
      return {
        valid: false,
        reason: "Report text is too short or empty.",
      };
    }
  
    const lowerText = text.toLowerCase();
  
    const matchedKeywords = MRI_KEYWORDS.filter((keyword) =>
      lowerText.includes(keyword)
    );
  
    if (matchedKeywords.length < 3) {
      return {
        valid: false,
        reason: "This does not appear to be a valid MRI report.",
      };
    }
  
    return {
      valid: true,
      reason: "Valid MRI report.",
    };
};