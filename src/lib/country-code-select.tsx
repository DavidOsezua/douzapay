import { useState, useEffect, FC } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Comprehensive list of countries with their codes
export const countryCodes = [
  { code: "AF", name: "Afghanistan", dialCode: "93" },
  { code: "AL", name: "Albania", dialCode: "355" },
  { code: "DZ", name: "Algeria", dialCode: "213" },
  { code: "AS", name: "American Samoa", dialCode: "1684" },
  { code: "AD", name: "Andorra", dialCode: "376" },
  { code: "AO", name: "Angola", dialCode: "244" },
  { code: "AI", name: "Anguilla", dialCode: "1264" },
  { code: "AG", name: "Antigua and Barbuda", dialCode: "1268" },
  { code: "AR", name: "Argentina", dialCode: "54" },
  { code: "AM", name: "Armenia", dialCode: "374" },
  { code: "AW", name: "Aruba", dialCode: "297" },
  { code: "AU", name: "Australia", dialCode: "61" },
  { code: "AT", name: "Austria", dialCode: "43" },
  { code: "AZ", name: "Azerbaijan", dialCode: "994" },
  { code: "BS", name: "Bahamas", dialCode: "1242" },
  { code: "BH", name: "Bahrain", dialCode: "973" },
  { code: "BD", name: "Bangladesh", dialCode: "880" },
  { code: "BB", name: "Barbados", dialCode: "1246" },
  { code: "BY", name: "Belarus", dialCode: "375" },
  { code: "BE", name: "Belgium", dialCode: "32" },
  { code: "BZ", name: "Belize", dialCode: "501" },
  { code: "BJ", name: "Benin", dialCode: "229" },
  { code: "BM", name: "Bermuda", dialCode: "1441" },
  { code: "BT", name: "Bhutan", dialCode: "975" },
  { code: "BO", name: "Bolivia", dialCode: "591" },
  { code: "BA", name: "Bosnia and Herzegovina", dialCode: "387" },
  { code: "BW", name: "Botswana", dialCode: "267" },
  { code: "BR", name: "Brazil", dialCode: "55" },
  { code: "IO", name: "British Indian Ocean Territory", dialCode: "246" },
  { code: "BN", name: "Brunei Darussalam", dialCode: "673" },
  { code: "BG", name: "Bulgaria", dialCode: "359" },
  { code: "BF", name: "Burkina Faso", dialCode: "226" },
  { code: "BI", name: "Burundi", dialCode: "257" },
  { code: "KH", name: "Cambodia", dialCode: "855" },
  { code: "CM", name: "Cameroon", dialCode: "237" },
  { code: "CA", name: "Canada", dialCode: "1" },
  { code: "CV", name: "Cape Verde", dialCode: "238" },
  { code: "KY", name: "Cayman Islands", dialCode: "1345" },
  { code: "CF", name: "Central African Republic", dialCode: "236" },
  { code: "TD", name: "Chad", dialCode: "235" },
  { code: "CL", name: "Chile", dialCode: "56" },
  { code: "CN", name: "China", dialCode: "86" },
  { code: "CX", name: "Christmas Island", dialCode: "61" },
  { code: "CC", name: "Cocos (Keeling) Islands", dialCode: "61" },
  { code: "CO", name: "Colombia", dialCode: "57" },
  { code: "KM", name: "Comoros", dialCode: "269" },
  { code: "CG", name: "Congo", dialCode: "242" },
  { code: "CD", name: "Congo, Democratic Republic", dialCode: "243" },
  { code: "CK", name: "Cook Islands", dialCode: "682" },
  { code: "CR", name: "Costa Rica", dialCode: "506" },
  { code: "CI", name: "Cote d'Ivoire", dialCode: "225" },
  { code: "HR", name: "Croatia", dialCode: "385" },
  { code: "CU", name: "Cuba", dialCode: "53" },
  { code: "CY", name: "Cyprus", dialCode: "357" },
  { code: "CZ", name: "Czech Republic", dialCode: "420" },
  { code: "DK", name: "Denmark", dialCode: "45" },
  { code: "DJ", name: "Djibouti", dialCode: "253" },
  { code: "DM", name: "Dominica", dialCode: "1767" },
  { code: "DO", name: "Dominican Republic", dialCode: "1849" },
  { code: "EC", name: "Ecuador", dialCode: "593" },
  { code: "EG", name: "Egypt", dialCode: "20" },
  { code: "SV", name: "El Salvador", dialCode: "503" },
  { code: "GQ", name: "Equatorial Guinea", dialCode: "240" },
  { code: "ER", name: "Eritrea", dialCode: "291" },
  { code: "EE", name: "Estonia", dialCode: "372" },
  { code: "ET", name: "Ethiopia", dialCode: "251" },
  { code: "FK", name: "Falkland Islands", dialCode: "500" },
  { code: "FO", name: "Faroe Islands", dialCode: "298" },
  { code: "FJ", name: "Fiji", dialCode: "679" },
  { code: "FI", name: "Finland", dialCode: "358" },
  { code: "FR", name: "France", dialCode: "33" },
  { code: "GF", name: "French Guiana", dialCode: "594" },
  { code: "PF", name: "French Polynesia", dialCode: "689" },
  { code: "GA", name: "Gabon", dialCode: "241" },
  { code: "GM", name: "Gambia", dialCode: "220" },
  { code: "GE", name: "Georgia", dialCode: "995" },
  { code: "DE", name: "Germany", dialCode: "49" },
  { code: "GH", name: "Ghana", dialCode: "233" },
  { code: "GI", name: "Gibraltar", dialCode: "350" },
  { code: "GR", name: "Greece", dialCode: "30" },
  { code: "GL", name: "Greenland", dialCode: "299" },
  { code: "GD", name: "Grenada", dialCode: "1473" },
  { code: "GP", name: "Guadeloupe", dialCode: "590" },
  { code: "GU", name: "Guam", dialCode: "1671" },
  { code: "GT", name: "Guatemala", dialCode: "502" },
  { code: "GG", name: "Guernsey", dialCode: "44" },
  { code: "GN", name: "Guinea", dialCode: "224" },
  { code: "GW", name: "Guinea-Bissau", dialCode: "245" },
  { code: "GY", name: "Guyana", dialCode: "592" },
  { code: "HT", name: "Haiti", dialCode: "509" },
  { code: "VA", name: "Holy See (Vatican City)", dialCode: "379" },
  { code: "HN", name: "Honduras", dialCode: "504" },
  { code: "HK", name: "Hong Kong", dialCode: "852" },
  { code: "HU", name: "Hungary", dialCode: "36" },
  { code: "IS", name: "Iceland", dialCode: "354" },
  { code: "IN", name: "India", dialCode: "91" },
  { code: "ID", name: "Indonesia", dialCode: "62" },
  { code: "IR", name: "Iran", dialCode: "98" },
  { code: "IQ", name: "Iraq", dialCode: "964" },
  { code: "IE", name: "Ireland", dialCode: "353" },
  { code: "IM", name: "Isle of Man", dialCode: "44" },
  { code: "IL", name: "Israel", dialCode: "972" },
  { code: "IT", name: "Italy", dialCode: "39" },
  { code: "JM", name: "Jamaica", dialCode: "1876" },
  { code: "JP", name: "Japan", dialCode: "81" },
  { code: "JE", name: "Jersey", dialCode: "44" },
  { code: "JO", name: "Jordan", dialCode: "962" },
  { code: "KZ", name: "Kazakhstan", dialCode: "7" },
  { code: "KE", name: "Kenya", dialCode: "254" },
  { code: "KI", name: "Kiribati", dialCode: "686" },
  { code: "KP", name: "Korea, North", dialCode: "850" },
  { code: "KR", name: "Korea, South", dialCode: "82" },
  { code: "KW", name: "Kuwait", dialCode: "965" },
  { code: "KG", name: "Kyrgyzstan", dialCode: "996" },
  { code: "LA", name: "Laos", dialCode: "856" },
  { code: "LV", name: "Latvia", dialCode: "371" },
  { code: "LB", name: "Lebanon", dialCode: "961" },
  { code: "LS", name: "Lesotho", dialCode: "266" },
  { code: "LR", name: "Liberia", dialCode: "231" },
  { code: "LY", name: "Libya", dialCode: "218" },
  { code: "LI", name: "Liechtenstein", dialCode: "423" },
  { code: "LT", name: "Lithuania", dialCode: "370" },
  { code: "LU", name: "Luxembourg", dialCode: "352" },
  { code: "MO", name: "Macao", dialCode: "853" },
  { code: "MK", name: "Macedonia", dialCode: "389" },
  { code: "MG", name: "Madagascar", dialCode: "261" },
  { code: "MW", name: "Malawi", dialCode: "265" },
  { code: "MY", name: "Malaysia", dialCode: "60" },
  { code: "MV", name: "Maldives", dialCode: "960" },
  { code: "ML", name: "Mali", dialCode: "223" },
  { code: "MT", name: "Malta", dialCode: "356" },
  { code: "MH", name: "Marshall Islands", dialCode: "692" },
  { code: "MQ", name: "Martinique", dialCode: "596" },
  { code: "MR", name: "Mauritania", dialCode: "222" },
  { code: "MU", name: "Mauritius", dialCode: "230" },
  { code: "YT", name: "Mayotte", dialCode: "262" },
  { code: "MX", name: "Mexico", dialCode: "52" },
  { code: "FM", name: "Micronesia", dialCode: "691" },
  { code: "MD", name: "Moldova", dialCode: "373" },
  { code: "MC", name: "Monaco", dialCode: "377" },
  { code: "MN", name: "Mongolia", dialCode: "976" },
  { code: "ME", name: "Montenegro", dialCode: "382" },
  { code: "MS", name: "Montserrat", dialCode: "1664" },
  { code: "MA", name: "Morocco", dialCode: "212" },
  { code: "MZ", name: "Mozambique", dialCode: "258" },
  { code: "MM", name: "Myanmar", dialCode: "95" },
  { code: "NA", name: "Namibia", dialCode: "264" },
  { code: "NR", name: "Nauru", dialCode: "674" },
  { code: "NP", name: "Nepal", dialCode: "977" },
  { code: "NL", name: "Netherlands", dialCode: "31" },
  { code: "NC", name: "New Caledonia", dialCode: "687" },
  { code: "NZ", name: "New Zealand", dialCode: "64" },
  { code: "NI", name: "Nicaragua", dialCode: "505" },
  { code: "NE", name: "Niger", dialCode: "227" },
  { code: "NG", name: "Nigeria", dialCode: "234" },
  { code: "NU", name: "Niue", dialCode: "683" },
  { code: "NF", name: "Norfolk Island", dialCode: "672" },
  { code: "MP", name: "Northern Mariana Islands", dialCode: "1670" },
  { code: "NO", name: "Norway", dialCode: "47" },
  { code: "OM", name: "Oman", dialCode: "968" },
  { code: "PK", name: "Pakistan", dialCode: "92" },
  { code: "PW", name: "Palau", dialCode: "680" },
  { code: "PS", name: "Palestine", dialCode: "970" },
  { code: "PA", name: "Panama", dialCode: "507" },
  { code: "PG", name: "Papua New Guinea", dialCode: "675" },
  { code: "PY", name: "Paraguay", dialCode: "595" },
  { code: "PE", name: "Peru", dialCode: "51" },
  { code: "PH", name: "Philippines", dialCode: "63" },
  { code: "PN", name: "Pitcairn", dialCode: "64" },
  { code: "PL", name: "Poland", dialCode: "48" },
  { code: "PT", name: "Portugal", dialCode: "351" },
  { code: "PR", name: "Puerto Rico", dialCode: "1939" },
  { code: "QA", name: "Qatar", dialCode: "974" },
  { code: "RE", name: "Reunion", dialCode: "262" },
  { code: "RO", name: "Romania", dialCode: "40" },
  { code: "RU", name: "Russia", dialCode: "7" },
  { code: "RW", name: "Rwanda", dialCode: "250" },
  { code: "BL", name: "Saint Barthélemy", dialCode: "590" },
  { code: "SH", name: "Saint Helena", dialCode: "290" },
  { code: "KN", name: "Saint Kitts and Nevis", dialCode: "1869" },
  { code: "LC", name: "Saint Lucia", dialCode: "1758" },
  { code: "MF", name: "Saint Martin", dialCode: "590" },
  { code: "PM", name: "Saint Pierre and Miquelon", dialCode: "508" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dialCode: "1784" },
  { code: "WS", name: "Samoa", dialCode: "685" },
  { code: "SM", name: "San Marino", dialCode: "378" },
  { code: "ST", name: "Sao Tome and Principe", dialCode: "239" },
  { code: "SA", name: "Saudi Arabia", dialCode: "966" },
  { code: "SN", name: "Senegal", dialCode: "221" },
  { code: "RS", name: "Serbia", dialCode: "381" },
  { code: "SC", name: "Seychelles", dialCode: "248" },
  { code: "SL", name: "Sierra Leone", dialCode: "232" },
  { code: "SG", name: "Singapore", dialCode: "65" },
  { code: "SX", name: "Sint Maarten", dialCode: "1721" },
  { code: "SK", name: "Slovakia", dialCode: "421" },
  { code: "SI", name: "Slovenia", dialCode: "386" },
  { code: "SB", name: "Solomon Islands", dialCode: "677" },
  { code: "SO", name: "Somalia", dialCode: "252" },
  { code: "ZA", name: "South Africa", dialCode: "27" },
  { code: "SS", name: "South Sudan", dialCode: "211" },
  { code: "ES", name: "Spain", dialCode: "34" },
  { code: "LK", name: "Sri Lanka", dialCode: "94" },
  { code: "SD", name: "Sudan", dialCode: "249" },
  { code: "SR", name: "Suriname", dialCode: "597" },
  { code: "SJ", name: "Svalbard and Jan Mayen", dialCode: "47" },
  { code: "SZ", name: "Swaziland", dialCode: "268" },
  { code: "SE", name: "Sweden", dialCode: "46" },
  { code: "CH", name: "Switzerland", dialCode: "41" },
  { code: "SY", name: "Syria", dialCode: "963" },
  { code: "TW", name: "Taiwan", dialCode: "886" },
  { code: "TJ", name: "Tajikistan", dialCode: "992" },
  { code: "TZ", name: "Tanzania", dialCode: "255" },
  { code: "TH", name: "Thailand", dialCode: "66" },
  { code: "TL", name: "Timor-Leste", dialCode: "670" },
  { code: "TG", name: "Togo", dialCode: "228" },
  { code: "TK", name: "Tokelau", dialCode: "690" },
  { code: "TO", name: "Tonga", dialCode: "676" },
  { code: "TT", name: "Trinidad and Tobago", dialCode: "1868" },
  { code: "TN", name: "Tunisia", dialCode: "216" },
  { code: "TR", name: "Turkey", dialCode: "90" },
  { code: "TM", name: "Turkmenistan", dialCode: "993" },
  { code: "TC", name: "Turks and Caicos Islands", dialCode: "1649" },
  { code: "TV", name: "Tuvalu", dialCode: "688" },
  { code: "UG", name: "Uganda", dialCode: "256" },
  { code: "UA", name: "Ukraine", dialCode: "380" },
  { code: "AE", name: "United Arab Emirates", dialCode: "971" },
  { code: "GB", name: "United Kingdom", dialCode: "44" },
  { code: "US", name: "United States", dialCode: "1" },
  { code: "UY", name: "Uruguay", dialCode: "598" },
  { code: "UZ", name: "Uzbekistan", dialCode: "998" },
  { code: "VU", name: "Vanuatu", dialCode: "678" },
  { code: "VE", name: "Venezuela", dialCode: "58" },
  { code: "VN", name: "Vietnam", dialCode: "84" },
  { code: "VG", name: "Virgin Islands, British", dialCode: "1284" },
  { code: "VI", name: "Virgin Islands, U.S.", dialCode: "1340" },
  { code: "WF", name: "Wallis and Futuna", dialCode: "681" },
  { code: "YE", name: "Yemen", dialCode: "967" },
  { code: "ZM", name: "Zambia", dialCode: "260" },
  { code: "ZW", name: "Zimbabwe", dialCode: "263" },
].sort((a, b) => a.name.localeCompare(b.name));

type CountryCodeSelectProps = {
  onSelect: (dialCode: string) => void;
  defaultCountry?: string;
  className?: string;
};

export const CountryCodeSelect: FC<CountryCodeSelectProps> = ({
  onSelect,
  defaultCountry = "US",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Set default country on initial render
  useEffect(() => {
    if (defaultCountry) {
      const country = countryCodes.find((c) => c.code === defaultCountry);
      if (country) {
        setValue(country.name);
        onSelect(country.dialCode);
      }
    }
  }, [defaultCountry, onSelect]);

  // Function to convert country code to flag emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char: string) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Find the selected country
  const selectedCountry = countryCodes.find(
    (country) => country.name === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="bg-transparent" asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={`text-dark-text-400 flex h-full w-[60px] justify-between text-sm ${className}`}
        >
          {selectedCountry ? (
            <>
              <span>{getFlagEmoji(selectedCountry.code)}</span>
              {selectedCountry.dialCode}
            </>
          ) : (
            "Country"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countryCodes.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    if (onSelect) {
                      onSelect(country.dialCode);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.code ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="mr-2">{getFlagEmoji(country.code)}</span>
                  <span className="mr-2">{country.dialCode}</span>
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
