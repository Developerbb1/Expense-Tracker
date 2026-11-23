interface PageHeaderProps {
  pageTitle: string;
  pageDescription: string;
  isPageHeaderButton?: boolean;
  pageHeaderButtonText?: string;
  pageHeaderButtonOnClick?: () => void;
}

export default function PageHeader({
  pageTitle,
  pageDescription,
  isPageHeaderButton = false,
  pageHeaderButtonText,
  pageHeaderButtonOnClick,
}: PageHeaderProps) {
  return (
    <>
      <header className="page-header">
        <div className="page-left">
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-description">{pageDescription}</p>
        </div>
        {isPageHeaderButton && (
          <button
            type="button"
            onClick={pageHeaderButtonOnClick}
            className="btn-action"
          >
            {pageHeaderButtonText}
          </button>
        )}
      </header>
    </>
  );
}
