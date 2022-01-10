import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";

class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>

                <div style={{marginLeft: "10%", width: "80%"}}>
                    <h1>Klauzula informacyjna RODO w zakresie przetwarzania danych osobowych</h1>
                    <br/>
                    <h5>
                        1. Administratorem danych osobowych jest POLITECHNIKA POZNAŃSKA, Pl. Marii Skłodowskiej-Curie 5, 60-965 Poznań
                        <br/><br/>
                        2. Administrator wyznaczył inspektora ochrony danych osobowych.
                        <br/><br/>
                        3. Przekazane dane osobowe przetwarzane będą w celu realizacji usług, obsługi zgłoszeń i udzielania odpowiedzi na zgłoszenia;
                        <br/><br/>
                        4. Kategorie danych osobowych obejmują m.in. imię i nazwisko, numer telefonu, adres e-mail, adres, dane dedykowane do procesu/usługi/projektu;
                        <br/><br/>
                        5. Pani / Pana dane osobowe mogą być przekazywane podmiotom przetwarzającym dane osobowe na zlecenie administratora: dostawcy usług IT;
                        <br/><br/>
                        6. Państwa dane osobowe będą przechowywane przez okres istnienia prawnie uzasadnionego interesu administratora, chyba że Pani / Pan wyrazi sprzeciw wobec przetwarzania danych;
                        <br/><br/>
                        7. Państwa dane nie będą przekazywane do państwa trzeciego ani organizacji międzynarodowej;
                        <br/><br/>
                        8. Posiadają Państwo prawo dostępu do treści swoich danych oraz prawo ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu, prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem;
                        <br/><br/>
                        9. Mają Państwo prawo wniesienia skargi do organu nadzorczego zajmującego się ochroną danych osobowych, którym jest Prezes Urzędu Ochrony Danych Osobowych, gdy uznają Państwo, iż przetwarzanie Państwa danych osobowych narusza przepisy ustawy z dnia 10 maja 2018 r. o ochronie danych osobowych (tekst jednolity Dz. U. z 2018 r., poz. 1000) lub przepisy Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) z dnia 27 kwietnia 2016 r. (Dz.Urz.UE.L Nr 119, str. 1);
                        <br/><br/>
                        10. Dane udostępnione przez Panią/Pana nie będą podlegały zautomatyzowanemu podejmowaniu decyzji oraz profilowaniu;
                        <br/><br/>
                        11. Dane pochodzą od osób, których dane dotyczą;
                        <br/><br/>
                        12. Podanie przez Państwa danych osobowych jest dobrowolne;
                    </h5>
                </div>
            </div>
        );
    }
}

export {PrivacyPolicy};
