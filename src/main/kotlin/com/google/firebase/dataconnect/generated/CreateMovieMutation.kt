
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated



public interface CreateMovieMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      CreateMovieMutation.Data,
      CreateMovieMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val title: String,
    val genre: String,
    val imageUrl: String
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("movie_insert") val key: MovieKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateMovie"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateMovieMutation.ref(
  
    title: String,genre: String,imageUrl: String,
  
  
): com.google.firebase.dataconnect.MutationRef<
    CreateMovieMutation.Data,
    CreateMovieMutation.Variables
  > =
  ref(
    
      CreateMovieMutation.Variables(
        title=title,genre=genre,imageUrl=imageUrl,
  
      )
    
  )

public suspend fun CreateMovieMutation.execute(
  
    title: String,genre: String,imageUrl: String,
  
  
  ): com.google.firebase.dataconnect.MutationResult<
    CreateMovieMutation.Data,
    CreateMovieMutation.Variables
  > =
  ref(
    
      title=title,genre=genre,imageUrl=imageUrl,
  
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
