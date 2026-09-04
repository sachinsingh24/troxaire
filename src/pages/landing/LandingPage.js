import { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput, { getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import heroImage from "../../assets/BG Troxaire.jpg";
import logo from "../../assets/Troxaire Logo White.png";
import companyProfile from "../../assets/Company Profile Troxaire.pdf";
import "./LandingPage.css";

function SocialIcon({ type }) {
  const icons = {
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="landing-page__dot" />
      </>
    ),
    facebook: <path d="M14.2 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.1H8.3V13H11v8h3.2Z" />,
    twitter: <path d="M21 6.2c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.5-1.6.8-2.5 1A3.8 3.8 0 0 0 11.5 9c0 .3 0 .6.1.9a10.8 10.8 0 0 1-7.8-4 3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5 0 1.9 1.4 3.6 3.4 4-.3.1-.7.1-1 .1-.3 0-.5 0-.7-.1.5 1.6 2 2.7 3.6 2.7A7.7 7.7 0 0 1 3.8 19 10.8 10.8 0 0 0 9.7 21c7.1 0 11-5.9 11-11v-.5c.8-.6 1.4-1.2 1.9-2Z" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function CountrySelector({ value, onChange, options, disabled, readOnly }) {
  const selectedCountry = value || "KE";
  const Flag = flags[selectedCountry];
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectorRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const countries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return options
      .filter((option) => !option.divider && option.value)
      .filter((option) => `${option.label} +${getCountryCallingCode(option.value)}`.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const closeMenu = (returnFocus = false) => {
    setIsOpen(false);
    setQuery("");
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (isOpen) menuRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsidePress = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  return (
    <div ref={selectorRef} className="landing-page__country-selector">
      <button ref={triggerRef} className="landing-page__country-trigger" type="button" onClick={() => setIsOpen((open) => !open)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setIsOpen(true); } }} disabled={disabled || readOnly} aria-label="Select country and dialing code" aria-expanded={isOpen}>
        <span className="landing-page__country-value">{Flag && <Flag className="landing-page__country-flag" role="img" aria-label={`${selectedCountry} flag`} title={`${selectedCountry} flag`} />}<span>+{getCountryCallingCode(selectedCountry)}</span></span>
        <span aria-hidden="true" className="landing-page__country-arrow" />
      </button>
      {isOpen && <div ref={menuRef} className="landing-page__country-menu" role="listbox" tabIndex="-1" aria-label="Country and dialing code. Type to filter." onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu(true);
        else if (event.key === "Backspace") setQuery((currentQuery) => currentQuery.slice(0, -1));
        else if (event.key === "Enter" && event.target === event.currentTarget && countries.length === 1) { onChange(countries[0].value); closeMenu(); }
        else if (event.key.length === 1) setQuery((currentQuery) => currentQuery + event.key);
      }}>
        <span className="landing-page__sr-only" aria-live="polite">{query ? `Filtering countries by ${query}` : "Type to filter countries"}</span>
        {countries.map((option) => {
          const OptionFlag = flags[option.value];
          return <button key={option.value} type="button" role="option" aria-selected={option.value === selectedCountry} onClick={() => { onChange(option.value); closeMenu(); }}>
            {OptionFlag && <OptionFlag className="landing-page__country-flag" aria-hidden="true" />}<span>{option.label}</span><strong>+{getCountryCallingCode(option.value)}</strong>
          </button>;
        })}
        {!countries.length && <p className="landing-page__country-empty">No matching country.</p>}
      </div>}
    </div>
  );
}

const initialForm = { name: "", number: "", email: "", company: "" };

function validateForm(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!values.number || !isValidPhoneNumber(values.number)) errors.number = "Please enter a valid phone number.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.company.trim().length < 2) errors.company = "Please enter your company name.";
  return errors;
}

export default function LandingPage() {
  const [formValues, setFormValues] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const updateField = ({ target }) => {
    const values = { ...formValues, [target.name]: target.value };
    setFormValues(values);
    if (formErrors[target.name]) setFormErrors(validateForm(values));
  };

  const updatePhone = (number) => {
    const values = { ...formValues, number: number || "" };
    setFormValues(values);
    if (formErrors.number) setFormErrors(validateForm(values));
  };

  const submitForm = (event) => {
    event.preventDefault();
    setFormErrors(validateForm(formValues));
  };

  return (
    <main className="landing-page" id="top" style={{ "--hero-image": `url("${heroImage}")` }}>
      <header className="landing-page__brand">
        <a className="landing-page__wordmark" href="#top">
          <img src={logo} alt="Troxaire - We care about healthy air" />
        </a>
      </header>
      <section className="landing-page__panel" aria-labelledby="landing-title">
        <div className="landing-page__panel-image" aria-hidden="true" />
        <div className="landing-page__intro">
          <h1 id="landing-title">Kenya's first dedicated HVAC airside products manufacturer.</h1>
          <p>Engineering airflow. Enhancing comfort. Protecting life.</p>
          <a className="landing-page__button" href={companyProfile} download="Company Profile Troxaire.pdf">
            Download company profile
          </a>
          <div className="landing-page__socials" aria-label="Social links">
            <a href="https://www.instagram.com" aria-label="Instagram">
              <SocialIcon type="instagram" />
            </a>
            <a href="https://www.facebook.com" aria-label="Facebook">
              <SocialIcon type="facebook" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <SocialIcon type="twitter" />
            </a>
          </div>
        </div>
        <form className="landing-page__form" noValidate onSubmit={submitForm}>
          <h2>Get in touch</h2>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" value={formValues.name} onChange={updateField} aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} />
            {formErrors.name && (
              <span id="name-error" className="landing-page__error">
                {formErrors.name}
              </span>
            )}
          </label>
          <label>
            Phone number
            <PhoneInput className="landing-page__phone-field" defaultCountry="KE" countrySelectComponent={CountrySelector} numberInputProps={{ "aria-invalid": Boolean(formErrors.number), "aria-describedby": formErrors.number ? "number-error" : undefined }} value={formValues.number || undefined} onChange={updatePhone} />
            {formErrors.number && (
              <span id="number-error" className="landing-page__error">
                {formErrors.number}
              </span>
            )}
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" value={formValues.email} onChange={updateField} aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "email-error" : undefined} />
            {formErrors.email && (
              <span id="email-error" className="landing-page__error">
                {formErrors.email}
              </span>
            )}
          </label>
          <label>
            Company name
            <input name="company" type="text" autoComplete="organization" value={formValues.company} onChange={updateField} aria-invalid={Boolean(formErrors.company)} aria-describedby={formErrors.company ? "company-error" : undefined} />
            {formErrors.company && (
              <span id="company-error" className="landing-page__error">
                {formErrors.company}
              </span>
            )}
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  );
}
