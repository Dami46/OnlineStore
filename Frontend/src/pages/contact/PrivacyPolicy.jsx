import {Component} from 'react';
import {NavbarTemplate} from "../navbar/NavbarTemplate";
import {Footer} from "./Footer";

class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{color: "#4cbde9", backgroundColor: '#212121', height: '100%'}}>
                <div>
                    <NavbarTemplate/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>


                <div style={{marginLeft: "10%", width: "80%"}}>
                    <h1>Information clause on the processing of personal data</h1>
                    <br/>
                    <h5>
                        1. The controller of personal data is POLITECHNIKA POZNAŃSKA, Pl. Marii Skłodowskiej-Curie 5, 60-965 Poznań
                        <br/><br/>
                        2. The controller appointed a personal data protection inspector.
                        <br/><br/>
                        3. The personal data provided will be processed in order to provide services, handle requests and respond to requests. 4;
                        <br/><br/>
                        4. Categories of personal data include, among others, name and surname, telephone number, e-mail address, address, data dedicated to the process/service/project;
                        <br/><br/>
                        5. Your personal data may be transferred to entities that process personal data on behalf of the controller: IT service providers;
                        <br/><br/>
                        6. Your personal data will be stored for the period of existence of the legally justified interest of the controller, unless you object to the processing;
                        <br/><br/>
                        7. Your data will not be transferred to a third country or international organisation;
                        <br/><br/>
                        8. You have the right to access your data and the right to rectify, erase, restrict processing, the right to data portability, the right to object, the right to withdraw consent at any time without affecting the legality of the processing, which was performed on the basis of consent before its withdrawal;
                        <br/><br/>
                        9. You have the right to lodge a complaint with the supervisory authority dealing with the protection of personal data, which is the President of the Office for Personal Data Protection, if you consider that the processing of your personal data violates the provisions of the Act of 10 May 2018 on the Protection of Personal Data (consolidated text Journal of Laws of 2018, item 1000) or the provisions of Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation) of 27 April 2016. (Dz.Urz.UE.L No. 119, p. 1);
                        <br/><br/>
                        10. The data provided by you will not be subject to automated decision-making and profiling;
                        <br/><br/>
                        11. The data comes from the data subjects;
                        <br/><br/>
                        12. Your provision of personal data is voluntary;
                    </h5>
                    {/*<h1>Klauzula informacyjna RODO w zakresie przetwarzania danych osobowych</h1>*/}
                    {/*<br/>*/}
                    {/*<h5>*/}
                    {/*    1. Administratorem danych osobowych jest POLITECHNIKA POZNAŃSKA, Pl. Marii Skłodowskiej-Curie 5, 60-965 Poznań*/}
                    {/*    <br/><br/>*/}
                    {/*    2. Administrator wyznaczył inspektora ochrony danych osobowych.*/}
                    {/*    <br/><br/>*/}
                    {/*    3. Przekazane dane osobowe przetwarzane będą w celu realizacji usług, obsługi zgłoszeń i udzielania odpowiedzi na zgłoszenia;*/}
                    {/*    <br/><br/>*/}
                    {/*    4. Kategorie danych osobowych obejmują m.in. imię i nazwisko, numer telefonu, adres e-mail, adres, dane dedykowane do procesu/usługi/projektu;*/}
                    {/*    <br/><br/>*/}
                    {/*    5. Pani / Pana dane osobowe mogą być przekazywane podmiotom przetwarzającym dane osobowe na zlecenie administratora: dostawcy usług IT;*/}
                    {/*    <br/><br/>*/}
                    {/*    6. Państwa dane osobowe będą przechowywane przez okres istnienia prawnie uzasadnionego interesu administratora, chyba że Pani / Pan wyrazi sprzeciw wobec przetwarzania danych;*/}
                    {/*    <br/><br/>*/}
                    {/*    7. Państwa dane nie będą przekazywane do państwa trzeciego ani organizacji międzynarodowej;*/}
                    {/*    <br/><br/>*/}
                    {/*    8. Posiadają Państwo prawo dostępu do treści swoich danych oraz prawo ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu, prawo do cofnięcia zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem;*/}
                    {/*    <br/><br/>*/}
                    {/*    9. Mają Państwo prawo wniesienia skargi do organu nadzorczego zajmującego się ochroną danych osobowych, którym jest Prezes Urzędu Ochrony Danych Osobowych, gdy uznają Państwo, iż przetwarzanie Państwa danych osobowych narusza przepisy ustawy z dnia 10 maja 2018 r. o ochronie danych osobowych (tekst jednolity Dz. U. z 2018 r., poz. 1000) lub przepisy Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) z dnia 27 kwietnia 2016 r. (Dz.Urz.UE.L Nr 119, str. 1);*/}
                    {/*    <br/><br/>*/}
                    {/*    10. Dane udostępnione przez Panią/Pana nie będą podlegały zautomatyzowanemu podejmowaniu decyzji oraz profilowaniu;*/}
                    {/*    <br/><br/>*/}
                    {/*    11. Dane pochodzą od osób, których dane dotyczą;*/}
                    {/*    <br/><br/>*/}
                    {/*    12. Podanie przez Państwa danych osobowych jest dobrowolne;*/}
                    {/*</h5>*/}
                </div>
                <Footer/>
            </div>
        );
    }
}

export {PrivacyPolicy};
