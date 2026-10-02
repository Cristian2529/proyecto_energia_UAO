import pandas as pd
import os

print("Iniciando procesamiento del dataset...")

# Ruta al archivo original
data_path = os.path.join('dataset', 'household_power_consumption.txt')

# Cargar el dataset especificando el separador ';'
df = pd.read_csv(data_path, sep=';', low_memory=False)

# Reemplazar el caracter '?' que representa valores faltantes por NaN
df.replace('?', pd.NA, inplace=True)

# Limpieza: Eliminar filas con valores faltantes
df.dropna(inplace=True)

# Tomamos los primeros 100,000 registros para optimizar el rendimiento
df_subset = df.head(100000)

# Convertir tipos de datos numéricos
numeric_cols = ['Global_active_power', 'Global_reactive_power', 'Voltage', 'Global_intensity', 'Sub_metering_1', 'Sub_metering_2', 'Sub_metering_3']
for col in numeric_cols:
    df_subset[col] = pd.to_numeric(df_subset[col])

# Exportar a CSV limpio
output_path = 'datos_limpios.csv'
df_subset.to_csv(output_path, index=False)

print(f"Limpieza completada. Archivo '{output_path}' generado con {len(df_subset)} registros.")