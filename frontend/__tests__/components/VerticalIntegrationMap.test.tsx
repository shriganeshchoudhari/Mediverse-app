import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerticalIntegrationMap, {
  Integration,
} from '@/components/curriculum/VerticalIntegrationMap';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('VerticalIntegrationMap Component', () => {
  const mockIntegrations: Integration[] = [
    {
      type: 'vertical',
      targetSubject: 'Cardiovascular Medicine',
      targetCode: 'MED-CARD',
      competencyRef: 'IM2.1',
      description: 'Coronary artery disease and ischemic heart disease cross-phase clinical correlation',
    },
    {
      type: 'vertical',
      targetSubject: 'Cardiothoracic Surgery',
      targetCode: 'SURG-CTS',
      competencyRef: 'SU1.4',
      description: 'Surgical anatomy of mediastinum and pericardial cavity',
    },
    {
      type: 'horizontal',
      targetSubject: 'Medical Biochemistry',
      targetCode: 'BIO-CARD',
      competencyRef: 'BI6.2',
      description: 'Lipid profile and cardiac biomarker pathways in myocardial infarction',
    },
    {
      type: 'horizontal',
      targetSubject: 'Human Physiology',
      targetCode: 'PHYS-CARD',
      competencyRef: 'PY5.1',
      description: 'Cardiac cycle, Wiggers diagram, and electrophysiology of arrhythmias',
    },
  ];

  test('renders subjectTitle and subjectCode in header', () => {
    render(
      <VerticalIntegrationMap
        subjectCode="ANAT-CV"
        subjectTitle="Gross Anatomy of Thorax"
        integrations={mockIntegrations}
      />
    );

    expect(
      screen.getByText('Integration Map: Gross Anatomy of Thorax (ANAT-CV)')
    ).toBeInTheDocument();
  });

  test('renders vertical integration items under vertical section', () => {
    render(
      <VerticalIntegrationMap
        subjectCode="ANAT-CV"
        subjectTitle="Gross Anatomy of Thorax"
        integrations={mockIntegrations}
      />
    );

    expect(screen.getByText('Vertical Integration (Cross-Phase)')).toBeInTheDocument();
    expect(screen.getByText('Cardiovascular Medicine')).toBeInTheDocument();
    expect(screen.getByText('IM2.1')).toBeInTheDocument();
    expect(
      screen.getByText(/Coronary artery disease and ischemic heart disease/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Cardiothoracic Surgery')).toBeInTheDocument();
    expect(screen.getByText('SU1.4')).toBeInTheDocument();
  });

  test('renders horizontal integration items under horizontal section', () => {
    render(
      <VerticalIntegrationMap
        subjectCode="ANAT-CV"
        subjectTitle="Gross Anatomy of Thorax"
        integrations={mockIntegrations}
      />
    );

    expect(screen.getByText('Horizontal Integration (Same Phase)')).toBeInTheDocument();
    expect(screen.getByText('Medical Biochemistry')).toBeInTheDocument();
    expect(screen.getByText('BI6.2')).toBeInTheDocument();
    expect(
      screen.getByText(/Lipid profile and cardiac biomarker pathways/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Human Physiology')).toBeInTheDocument();
    expect(screen.getByText('PY5.1')).toBeInTheDocument();
  });

  test('search input filters integration items by target subject, competency, and description', () => {
    render(
      <VerticalIntegrationMap
        subjectCode="ANAT-CV"
        subjectTitle="Gross Anatomy of Thorax"
        integrations={mockIntegrations}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search topics, competencies...');

    // Filter by subject name
    fireEvent.change(searchInput, { target: { value: 'Surgery' } });
    expect(screen.getByText('Cardiothoracic Surgery')).toBeInTheDocument();
    expect(screen.queryByText('Cardiovascular Medicine')).not.toBeInTheDocument();
    expect(screen.queryByText('Medical Biochemistry')).not.toBeInTheDocument();
    expect(screen.queryByText('Human Physiology')).not.toBeInTheDocument();

    // Filter by competency ref
    fireEvent.change(searchInput, { target: { value: 'BI6.2' } });
    expect(screen.getByText('Medical Biochemistry')).toBeInTheDocument();
    expect(screen.queryByText('Cardiothoracic Surgery')).not.toBeInTheDocument();

    // Filter by description keyword
    fireEvent.change(searchInput, { target: { value: 'arrhythmias' } });
    expect(screen.getByText('Human Physiology')).toBeInTheDocument();
    expect(screen.queryByText('Medical Biochemistry')).not.toBeInTheDocument();

    // Empty search shows all
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Cardiovascular Medicine')).toBeInTheDocument();
    expect(screen.getByText('Cardiothoracic Surgery')).toBeInTheDocument();
    expect(screen.getByText('Medical Biochemistry')).toBeInTheDocument();
    expect(screen.getByText('Human Physiology')).toBeInTheDocument();
  });

  test('renders empty state messages when no integrations match search', () => {
    render(
      <VerticalIntegrationMap
        subjectCode="ANAT-CV"
        subjectTitle="Gross Anatomy of Thorax"
        integrations={mockIntegrations}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search topics, competencies...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentKeywordXYZ' } });

    const emptyMessages = screen.getAllByText('No integrations found.');
    expect(emptyMessages).toHaveLength(2);
  });
});
