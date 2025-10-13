"use client";

import React, { useState } from "react";
import ContributionToggle from "./ContributionToggle";
import ContributionForm from "./ContributionForm";

const ContributionManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ContributionToggle onToggle={handleToggle} isOpen={isOpen} />
      <ContributionForm isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default ContributionManager;
