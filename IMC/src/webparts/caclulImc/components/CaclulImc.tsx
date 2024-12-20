import * as React from "react";
import { FC, useState, ChangeEvent } from "react";
import styles from "./CaclulImc.module.scss";
import type { ICaclulImcProps } from "./ICaclulImcProps";
// import { escape } from '@microsoft/sp-lodash-subset';

interface IMCProps {
  weight: number; 
  height: number;
  result: string; 
  info: string; 
  color: string;
}
const BMIData = [
  { name: "Maigreur", color: "midnightblue", range: [0, 18.5] },
  { name: "Bonne santé", color: "green", range: [18.5, 25] },
  { name: "Surpoids", color: "lightcoral", range: [25, 30] },
  { name: "Obésité modérée", color: "orange", range: [30, 35] },
  { name: "Obésité sévère", color: "crimson", range: [35, 40] },
  { name: "Obésité morbide", color: "purple", range: [40] },
];

const CaclulImc: FC<ICaclulImcProps> = () => {
  const [imcValues, setImcValues] = useState<IMCProps>({
    weight: 0, 
    height: 0,
    result: '0', 
    info: 'En attente de resultat...',
    color: ''
  }); 

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);

    if (event.target.name === 'height') {
      setImcValues(prevValue => {
        return {...prevValue, height: parseInt(event.target.value) }
      });
    } else if(event.target.name === 'weight') {
      setImcValues(prevValue => {
        return {...prevValue, weight: parseInt(event.target.value) }
      });
    }
    
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (imcValues.height <= 0 || imcValues.weight <= 0) {
      handleError();
      return;
    }

    calculateIMC();
  }
  function handleError() {
    setImcValues(preValue => {
      return { ...preValue, result: 'Woops!', info: 'Veuillez renseigner une valeur supéreieur à Zero. ' }
    });
  }
  function calculateIMC() {
    const imc = +(imcValues.weight / Math.pow(imcValues.height / 100, 2)).toFixed(1);

    const bmiDt = BMIData.find(data => {
      if (data.range.length === 1) {
        if (data.range[0] <= imc) {
          return data;
        }
      } else {
        if (data.range[0] <= imc && data.range[1] >= imc) {
          return data;
        }
      }
    });
    if (bmiDt?.name) {
      setImcValues(preValue => {
        return {
          ...preValue,
          result: imc.toString(),
          info: bmiDt?.name,
          color: bmiDt.color
        }
      });      
    }
  }
  return (
    <section className={styles.main}>
      <div className={styles.container}>
        <h1>
          Calcul <span>d'IMC</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="height">Votre taille en centimère</label>
              <input
                type="number"
                name="height"
                id="height"
                placeholder="Entrez votre taille"
                value={imcValues.height}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="weight">Votre poids en kilogramme</label>
              <input
                type="number"
                name="weight"
                id="weight"
                placeholder="Entrez votre poids"
                value={imcValues.weight}
                onChange={handleChange}
              />
            </div>
          </div>
          <button>Cacluler un IMC</button>
        </form>

        <div className={styles.infos}>
          <p className={styles.imcResult} style={{color: `${imcValues.color}`}}>{imcValues.result}</p>
          <p className={styles.imcInfo}>{imcValues.info}</p>
        </div>
      </div>
    </section>
  );
};

export default CaclulImc;